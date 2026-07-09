require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const dbgr = require('debug')("development:app");
const expressSession = require('express-session');
const flash = require("connect-flash");
const cookie = require("cookie");

const adminRouter = require('./routes/adminRouter');
const authRouter = require('./routes/authRouter');
const commentRouter = require('./routes/commentRouter');
const homeRouter = require('./routes/homeRouter');
const imageRouter = require('./routes/imageRouter');
const postRouter = require('./routes/postRouter');
const userRouter = require('./routes/userRouter');
const chatsRouter = require('./routes/chatsRouter');

const connectDb = require('./config/db');
const upload = require('./config/multerconfig');

const userModel = require("./models/user");
const postModel = require("./models/post");
const commentModel = require("./models/comment");
const conversationModel = require('./models/conversation');
const messageModel = require('./models/message');


connectDb();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname , "public")));
app.set('view engine','ejs');
app.use(cookieParser());
app.use(
    expressSession({
        resave : false,
        saveUninitialized : false,
        secret : process.env.EXPRESS_SESSION_SECRET,
    })
);
app.use(flash());

app.use('/',homeRouter);
app.use('/user',userRouter);
app.use('/post',postRouter);
app.use('/auth',authRouter);
app.use('/comment',commentRouter);
app.use('/image',imageRouter);
app.use('/admin',adminRouter);
app.use('/chats',chatsRouter);

// all the chat logic here for messanging still in work 

io.on('connection',(socket)=>{
    // console.log(socket.handshake.headers)
     socket.on('Join your chat room', async (data) => {
        try {
            const rawCookie = socket.handshake.headers.cookie ;
            let ParsedCookie;
            ParsedCookie = cookie.parseCookie(rawCookie).token;
            const roomId = await jwt.verify(ParsedCookie , process.env.JWT_KEY).username;
            socket.join(roomId);   
            console.log(`Socket ${socket.id} successfully joined room: ${roomId}`);
            
        } catch (error) {
            console.error("Failed to join room:", error);
        }
    });

    socket.on('chat message', async (msg)=>{
        
        const rawCookie = socket.handshake.headers.cookie ;
        let ParsedCookie;
        ParsedCookie = cookie.parseCookie(rawCookie).token;
        const data= await jwt.verify(ParsedCookie , process.env.JWT_KEY);
        const receiverUser = await userModel.findOne({_id : msg.receiver}).select('username');
        let message = await messageModel.create({
            conversation : msg.conversation,
            sender : data.userid,
            receiver : receiverUser._id,
            message : msg.message
        });
        console.log(msg);
        io.to(data.username).emit('chat message', message);
        io.to(receiverUser.username).emit('chat message', message);
    });  
});


const notfound = require('./middlewares/notFound');
const message = require('./models/message');

app.use(notfound);

server.listen(3000 , ()=>{ console.log("Server running")});