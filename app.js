const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const connectDb = require('./config/db');
const userModel = require("./models/user");
const postModel = require("./models/post");
const commentModel = require("./models/comment");
const multerconfig = require('./config/multerconfig');
const upload = require('./config/multerconfig');
const fs = require('fs');

require('dotenv').config();
connectDb();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname , "public")));
app.set('view engine','ejs');
app.use(cookieParser());

app.get('/' ,isLoggedIn , async(req, res)=>{
    let useremail = req.user.email;
    let user = await userModel.findOne({email : useremail});
    return res.render('index',{user});
}); 

app.get('/view/:username',isLoggedIn , async (req, res)=>{
    // for now I am seprading the select and populate but we can write it together also as per needed in future ;
    let user = await userModel.findOne({username : req.params.username});
    if(!user){
        return res.redirect('/');
    }
    let curruser = await userModel.findOne({email : req.user.email});
    await user.populate('posts');  // populating posts in user object 
    return res.render('profile',{user , curruser});
});

app.get('/editProfile' , isLoggedIn , async(req,res)=>{
    let user = await userModel.findOne({email : req.user.email});
    return res.render('editProfile',{user});
})

app.get('/login',(req,res)=>{
    return res.render('login');
});
app.get('/register',(req, res)=>{
    return res.render('register');
});

app.get('/logout',(req, res)=>{
    res.cookie("token","");
    res.redirect('login')
});

app.get('/likePost/:postid' , isLoggedIn , async (req, res)=>{
    let post = await postModel.findOne({ _id : req.params.postid });
    let user = await userModel.findOne({ email : req.user.email});
    let alreadyLiked = post.likes.some(id =>{
        // I am using equals because here we are comparing objectId here
        return id.equals(user._id);
    });
    // same here I am using eqals + filter to create a like/unlike toggle logic 
    if(alreadyLiked){
        post.likes = post.likes.filter( id =>{
           return  !id.equals(user._id);
        }); 
    }else{
        post.likes.push(user._id);
    }
    await post.save();
    return res.redirect(req.get('referer'));
});

app.post('/updateUser', isLoggedIn ,upload.single('image'), async (req, res)=>{
    let user =  await userModel.findOne({email : req.user.email});
    let image =  user.profilepic ;
    // console.log(req.file);
    let updateUser = await userModel.findOneAndUpdate({email : req.user.email} ,{
        name : req.body.name,
        email : req.body.email,
        username : req.body.username ,
        age : req.body.age ,
        profilepic : req.file.filename,
    });
    // code for deleteing the previous existing file 
    if(image !== "default.webp"){
        const ImgPath = `./public/images/uploads/${image}` ;
        if(fs.existsSync(ImgPath)){
            await fs.promises.unlink(ImgPath);
        }
    }
    return res.redirect(req.get('referer'));

});
app.post('/createUser',async (req, res )=>{
    console.log("Starting resistering");
    let {email , password , username , name , age } = req.body ;

    let emailUser = await userModel.findOne({email});
    let usernameUser = await userModel.findOne({username});

    if(emailUser && usernameUser){
        return res.render('register',{msg : "Email and username  alredy exists"});
    }else if(emailUser){
        return res.render('register',{msg : "Email alredy exists"});
    }else if(usernameUser){
        return res.render('register',{msg : "username is alredy taken"});
    }else{
        let hashpass = await bcrypt.hash(password , 10);
        let newUser = await userModel.create({email , password : hashpass , username , name , age});
        let token = await jwt.sign({email , userid : newUser._id}, process.env.JWT_KEY);
        res.cookie("token",token);
        return res.redirect('/');    
    }
});

app.post('/login', async (req, res)=>{
    let {email , password} = req.body;
    let user = await userModel.findOne({email});
    if(user === null){
        return res.render('login',{msg : "No User Found"});
    }else{
        let validity = await bcrypt.compare(password ,user.password);
        if(validity){
            let token = jwt.sign({email , userid : user._id}, process.env.JWT_KEY);
            res.cookie("token",token);
            return res.redirect('/');
        }else{
            return res.render('login',{msg : "Incorrect Password"});
        }
    }
});

app.post('/createPost', isLoggedIn ,async (req, res)=>{
    let content = req.body.content;
    let user = await userModel.findOne({email : req.user.email});
    let newPost = await postModel.create({
        user : user._id,
        content
    });
    user.posts.push(newPost._id);
    await user.save();
    res.redirect('/profile');
});

// middleware

async function isLoggedIn(req ,res , next){
    let token = req.cookies.token ;
    try{
        let data = await jwt.verify(token, process.env.JWT_KEY);
        req.user = data ;
        return next();
    }catch(err){
        return res.render('register');
    }
}


app.listen(3000 , ()=>{ console.log("Server running")});