const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userModel = require("../models/user");
const postModel = require("../models/post");
const commentModel = require("../models/comment");
const messageModel = require('../models/message');
const conversationModel = require('../models/conversation');

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
    console.log("At messages");
    let user = await userModel.findOne({ email : req.user.email}).select('-followers -following');
    let Chatusers = conversationModel.find({participants : user._id}).limit(20).sort({updatedAt : -1 });
    res.render('chats', {Chatusers});
    // console.log(chatusers);
});

router.get('/messages/:username', isLoggedIn , async (req, res) =>{
    console.log("Malik chat khol do ");
    let user = await userModel.findOne({ email : req.user.email}).select('-followers -following');
    let userToChatWith = await userModel.findOne({ username : req.params.username});
    if(!userToChatWith){
        console.log('are galat user hai');
        res.redirect(req.get('referer'));
        return ;
    }else{
        console.log("User to theek lag rha hai");
        let conversation = await conversationModel.findOne({
            // write from chatgpt to ensure that there is only one to one conversation exists
            participants :{
                $all : [user._id , userToChatWith._id ]
            },
            $expr: {
                $eq: [{ $size: "$participants" }, 2]
            }
        });
        if(!conversation){
            let newConversation = await conversationModel.create({
                participants : [req.user._id , userToChatWith._id],
            });
        }                    
    }
     let Chatusers = await conversationModel.find({participants : user._id}).limit(20).sort({updatedAt : -1 });
        console.log("YAHA TAK PAHUCH GYE MALIK < MESSAGE : /username");
        try{
            res.render('chats',{Chatusers , userToChatWith});
            console.log("Render ho gya messages > chat with user");
            return ;
        }catch(err){
            console.log(err.message);
        }

});



module.exports = router ;