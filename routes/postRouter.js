const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middlewares/isLoggedIn');
const uploadToCloudinary = require('../middlewares/uploadToCloudinary');
const deleteFromCloudinary = require('../middlewares/deletefromCloudinary');

const upload = require('../config/multerconfig');
const cloudinary = require('../config/cloudinary');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userModel = require("../models/user");
const postModel = require("../models/post");
const commentModel = require("../models/comment");

router.post('/like/:postid' , isLoggedIn , async (req, res)=>{
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
        post.likeCount = post.likes.length;
    }else{
        post.likes.push(user._id);
        post.likeCount = post.likes.length;
    }
    await post.save();
    res.json({msg :" post like updated Successfully"});
});

router.post('/delete/:postid', isLoggedIn ,async (req, res)=>{
    let post = await postModel.findOne({_id : req.params.postid}).select('user _id');
    if(post.user.toString() == req.user._id.toString()){
        try{
            let deletedPost = await postModel.deleteOne({_id : post._id}).select('images').lean();
            await deleteFromCloudinary(deletedPost.images);
            res.redirect(req.get('referer'));
        }catch(err){
            console.log(err);
            res.status(500).json({msg : 'Some error occured'});
        }
    }else{
        res.status(401).json({msg : 'unauthorized'});
    }
});

router.post('/create', isLoggedIn , upload.array('images', 10), uploadToCloudinary, async (req, res)=>{
    const post = await postModel.create({
        content : req.body.content,
        user : req.user._id,
        images : req.images,
    });
    // console.log(post);
    return res.redirect(req.get('referer'));
});




module.exports = router ;