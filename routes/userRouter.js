const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const uploadToCloudinary = require('../middlewares/uploadToCloudinary');
const deleteFromCloudinary = require('../middlewares/deletefromCloudinary');
const upload = require('../config/multerconfig');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userModel = require("../models/user");
const postModel = require("../models/post");
const commentModel = require("../models/comment");
const conversationModel = require("../models/conversation");
const messageModel = require("../models/message");


const user = require('../models/user');

router.get('/edit' , isLoggedIn , async(req,res)=>{
    let user = await userModel.findOne({email : req.user.email});
    return res.render('editProfile',{user});
})


router.get('/view/:username',isLoggedIn , async (req, res)=>{
    // for now I am seprading the select and populate but we can write it together also as per needed in future ;
    let user = await userModel.findOne({username : req.params.username}).select('-password').lean();
    if(!user){
        return res.redirect('/xyz');
    }
    let curruser = await userModel.findOne({email : req.user.email});
    let posts = await postModel.find({user : user._id}).sort({createdAt : -1}).limit(10).populate('user','username profilepic');
    posts.forEach(post=>{
        post.isLiked = post.likes.some(
            likeId => likeId.toString() === user._id.toString()
        );
    });
    let isFollowing = user.followers.some(
        id => id.equals(curruser._id)
    );
    delete user.followers;
    delete user.following;
    
    return res.render('profile',{user , curruser , posts , isFollowing});
});

router.get('/search/:username', isLoggedIn , async (req, res , next)=>{
    // using .lean() to convert mongoose user object , to a plain JS object 
    let user = await userModel.findOne({username : req.params.username}).select('name username profilepic').lean();
    if(!user){
        return res.status(404).json({found : false});
    }else{
        user.found = true ;
        return res.status(200).json(user);
    }
    return next();
})


router.post('/create',async (req, res )=>{
    let {email , password , username , name , age } = req.body;
    age = Number(req.body.age);
    
    if(username.length <4){
        return res.render('register',{msg : "username must atleast of length 4"});
    }else if(typeof age !== "number"){
        return res.render('register',{msg : "age should be only number"});
    }else if(age <18){
        return res.render('register',{msg : "you must be atleast 18 to create account"});
    }else if(age >120){
        return res.render('register',{msg : "Invalid age"});
    }else if(!email.includes("@")){
        return res.render('register',{msg : "Invalid email"});
    }else if(password.length <5){
        return res.render('register',{msg : "Passowrd must be of length of 5 minimum"});
    }

    let emailUser = await userModel.findOne({email});
    let usernameUser = await userModel.findOne({username});

    if(emailUser && usernameUser){
        return res.render('register',{msg : "Email and username  alredy exists"});
    }else if(emailUser){
        return res.render('register',{msg : "Email alredy exists"});
    }else if(usernameUser){
        return res.render('register',{msg : "username is alredy taken"});
    }else{
        try{
            let hashpass = await bcrypt.hash(password , 10);
            let newUser = await userModel.create({
                email ,
                password : hashpass ,
                username ,
                name ,
                age ,
                profilepic :{
                    url : process.env.USER_DEFAULT_PIC,
                    filename : process.env.USER_DEFAULT_PIC_PUBLIC_ID
                }
                });
            let token = await jwt.sign({email , userid : newUser._id , username}, process.env.JWT_KEY);
            res.cookie("token",token);
            return res.redirect('/');  
        }catch(err){
            return res.render('register',{msg : "failed to create user account"});
        }
    }
});

router.post('/update', isLoggedIn ,upload.single('image'), uploadToCloudinary, async (req, res)=>{
    let { password ,bio , name , age } = req.body;
    let user =  await userModel.findOne({email : req.user.email});
    
    if(req.body.delete && user.profilepic.url != process.env.USER_DEFAULT_PIC ){
        await deleteFromCloudinary(user.profilepic);
        req.image = {};
        req.image = {
            url : process.env.USER_DEFAULT_PIC,
            filename : process.env.USER_DEFAULT_PIC_PUBLIC_ID ,
        };
    }
    let updateUser = await userModel.findOneAndUpdate({email : req.user.email} ,{
        name : name,
        age :age,
        profilepic : req.image,
        bio : bio
    });
    return res.redirect(`/user/view/${user.username}`);
});

router.post('/follow/:username', isLoggedIn , async (req, res)=>{
    let curruser = await userModel.findOne({email : req.user.email});
    let user = await userModel.findOne({username : req.params.username});
    if(!user){
        return res.status(404).json({msg : "No such user"});
    }

    let isFollowing = user.followers.some((userid)=>{
        return userid.equals(curruser._id);
    });

    if(isFollowing){
        user.followers = user.followers.filter((id)=>{
            return id.toString() !== curruser._id.toString() ;
        });
        curruser.following = curruser.following.filter(
            id => id.toString() !==user._id.toString()
        );
    }else{
        user.followers.push(curruser._id);
        curruser.following.push(user._id);
    }
    user.followerCount = user.followers.length ;
    curruser.followingCount = curruser.following.length ;
    await user.save();
    await curruser.save();
    res.status(200).json({msg : isFollowing ? 'unfollowed': 'followed'});
    
});

router.get('/posts/:userid', isLoggedIn , async (req, res)=>{
    const page = Number(req.query.page) || 1;
        const limit = 10;
        try{
            const posts = await postModel.find({user :req.params.userid }).sort({createdAt : -1}).skip((page -1)*limit).populate('user','username profilepic name email _id').lean();
    
            posts.forEach(post=>{
                post.isLiked = post.likes.some(
                    likeId => likeId.toString() === req.user._id.toString()
                );
                post.curruser = req.user.username;
            });
    
            return res.json(posts);
        }catch(err){
            console.log(err.message);
            return res.json({msg : "No more posts"});
        }
});

router.get('/searchUsers' , isLoggedIn , async (req, res)=>{
    let users = await userModel.find().sort({_id : -1}).limit(10).select('username  name  profilepic');
    res.render('searchUserPage',{users});
});

router.get('/followers/:username',isLoggedIn , async (req, res)=>{
    try{
        let user = await userModel.findOne({username : req.params.username})
        .select('name username profilepic  followers')
        .populate('followers','name username profilepic');
        return res.status(200).render('followers', {user});
    }catch(err){
        console.log(err.message);
    }
});

router.get('/following/:username',isLoggedIn , async (req, res)=>{
    try{
        let user = await userModel.findOne({username : req.params.username})
        .select('name username profilepic following')
        .populate('following','name username profilepic');

        return res.status(200).render('following', {user});
    }catch(err){
        console.log(err.message);
        res.redirect(req.get('referer'));
    }
});




module.exports = router ;