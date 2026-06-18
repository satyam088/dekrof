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
const user = require('../models/user');

router.get('/edit' , isLoggedIn , async(req,res)=>{
    let user = await userModel.findOne({email : req.user.email});
    return res.render('editProfile',{user});
})


router.get('/view/:username',isLoggedIn , async (req, res)=>{
    // for now I am seprading the select and populate but we can write it together also as per needed in future ;
    let user = await userModel.findOne({username : req.params.username});
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
    return res.render('profile',{user , curruser , posts});
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
        let token = await jwt.sign({email , userid : newUser._id}, process.env.JWT_KEY);
        res.cookie("token",token);
        return res.redirect('/');    
    }
});

router.post('/update', isLoggedIn ,upload.single('image'), uploadToCloudinary, async (req, res)=>{
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
        name : req.body.name,
        email : req.body.email,
        username : req.body.username ,
        age : req.body.age ,
        profilepic : req.image,
    });
    return res.redirect(`/user/view/${user.username}`);
});

router.get('/searchUsers' , isLoggedIn , async (req, res)=>{
    let users = await userModel.find().sort({_id : -1}).limit(10).select('username  name  profilepic');
    res.render('searchUserPage',{users});
});


module.exports = router ;