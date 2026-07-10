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


router.get('/messages/:username', isLoggedIn , async (req, res) =>{
    // console.log("Malik chat khol do ");
    let userToChatWith ;
    let user = await userModel.findOne({ email : req.user.email}).select('-followers -following');
    if(req.params.username!="home"){
        userToChatWith = await userModel.findOne({ username : req.params.username});
    }
    if(!userToChatWith){
        console.log('are galat user hai');
    }else{
        userToChatWith =  userToChatWith.toObject();
        // console.log("User to theek lag rha hai");
        let conversation = await conversationModel.findOne({
            // write from chatgpt to ensure that there is only one to one conversation exists
            participants :{
                $all : [user._id , userToChatWith._id]
            },
            $expr: {
                $eq: [{ $size: "$participants" }, 2]
            }
        }).populate('lastMessage');
        // for new conversation 
        if(!conversation){
            let newConversation = await conversationModel.create({
                participants : [req.user._id , userToChatWith._id],
            });
        }                    
    }
     let conversations = await conversationModel.find({participants : user._id}).limit(20).sort({updatedAt : -1 });

     if(!conversations || conversations.length ==0){
        return res.render('chats',{conversations :[] , userToChatWith :null , currUser : user});
     }

     if(!userToChatWith){
        let userToChatWithID = conversations[0].participants.find(id=>{
            return  id.toString() !== user._id.toString();
        });
        userToChatWith = await userModel.findOne({_id : userToChatWithID});
        // run nemotron 3 ultra free
     }

     conversations = await Promise.all(

        conversations.map(async (conversation) =>{
            conversation = conversation.toObject();

            let otherUserId = conversation.participants.find((id)=>{
                if(userToChatWith._id.toString()== id.toString()){
                    userToChatWith.conversationId = conversation._id;
                }
                return id.toString() !== user._id.toString();
            });

            otherUserId = otherUserId.toString();

            const otherUser = await userModel.findOne({_id : otherUserId}).select('name username profilepic _id');

            let otherUserInfo = {
                    name : otherUser.name ,
                    profilepic : otherUser.profilepic,
                    username : otherUser.username,
                    _id : otherUser._id,
                    conversationId : conversation._id
            }
            conversation.otherUserInfo = otherUserInfo;
            return conversation ;

        })
    );

        if(!userToChatWith.conversationId){
            userToChatWith.conversationId = conversations[0]._id;
        }
        try{
            res.render('chats',{conversations , userToChatWith  , currUser : user});
            // console.log("Render ho gya messages > chat with user");
            return;
        }catch(err){
            console.log(err.message);
            return res.redirect('/home');
        }
});



module.exports = router ;