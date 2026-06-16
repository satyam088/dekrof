const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middlewares/isLoggedIn');
const uploadToCloudinary = require('../middlewares/uploadToCloudinary');

const upload = require('../config/multerconfig');
const cloudinary = require('../config/cloudinary');


const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userModel = require("../models/user");
const postModel = require("../models/post");
const commentModel = require("../models/comment");

router.get('/like/:postid' , isLoggedIn , async (req, res)=>{
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


router.post('/create', isLoggedIn , upload.array('images', 10), uploadToCloudinary, async (req, res)=>{
    
    const post = postModel.create({
        content : req.body.content,
        user : req.user.userid,
        images : req.images,
    })
    
    return res.redirect(req.get('referer'));
});




module.exports = router ;