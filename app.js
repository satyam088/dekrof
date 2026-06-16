const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const dbgr = require('debug')("development:app");
const expressSession = require('express-session');
const flash = require("connect-flash");

const adminRouter = require('./routes/adminRouter');
const authRouter = require('./routes/authRouter');
const commentRouter = require('./routes/commentRouter');
const homeRouter = require('./routes/homeRouter');
const imageRouter = require('./routes/imageRouter');
const postRouter = require('./routes/postRouter');
const userRouter = require('./routes/userRouter');

const connectDb = require('./config/db');
const upload = require('./config/multerconfig');

const userModel = require("./models/user");
const postModel = require("./models/post");
const commentModel = require("./models/comment");


require('dotenv').config();
connectDb();

const app = express();
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


const notfound = require('./middlewares/notFound');

app.use(notfound);

app.listen(3000 , ()=>{ console.log("Server running")});