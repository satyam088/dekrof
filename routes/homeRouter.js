const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userModel = require("../models/user");
const postModel = require("../models/post");
const commentModel = require("../models/comment");
const messageModel = require('../models/message');
const conversation = require('../models/conversation');

// async function abc() {
//     const users = await userModel.find();

//     for (const user of users) {
//         user.followers =[],
//           user.followerCount =0;
//             user.following =[];
//             user.followingCount  =0 ;
//             user.postCount =0;
//         await user.save();
//     }
// }

router.get('/',async (req,res)=>{
    // await abc();
    res.redirect('/home');
})

router.get('/home' ,isLoggedIn , async(req, res)=>{
    let useremail = req.user.email;
    let user = await userModel.findOne({email : useremail});
    let posts = await postModel.find().limit(10).sort({createdAt : -1}).populate('user');
    posts.forEach(post=>{
        post.isLiked = post.likes.some(
            likeId => likeId.toString() === user._id.toString()
        );
    });

    return res.render('index',{user , posts });
}); 

router.get('/feed', isLoggedIn , async (req, res)=>{
    const page = Number(req.query.page) || 1;
    const limit = 10;
    try{
        const posts = await postModel.find().sort({createdAt : -1}).skip((page -1)*limit).populate('user','username profilepic name email _id').lean();

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

router.get('/messages', isLoggedIn , async (req, res)=>{
    let user = await userModel.findOne({ email : req.user.email}).populate('followers following');
    let Chatusers = conversation.find({participants : user._id}).limit(20).sort({updatedAt : -1 });
    
    // console.log(chatusers);
    res.render('chats');
});






module.exports = router ;