const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');

const messageModel = require('../models/message');
const conversationModel = require('../models/conversation');

router.get('/get/:conversationId/:lastMessageId' , isLoggedIn , async(req , res)=>{
    console.log("Are bauji msg mang rha hai");
    let conversation = await conversationModel.findOne({
        _id : req.params.conversationId,
    });
    if(!conversation){
        // 6a4fa69933448d7636111f6f
        console.log(req.params.conversationId);
        return res.send("Unauthrized access");
    }
    const lastMessage = await messageModel.findOne({_id : req.params.lastMessageid});
    let Oldermessages;
    if(lastMessage){
             Oldermessages = await messageModel.find(
            {
                conversation : req.params.conversationId,
                createdAt :{$lt : lastMessage.createdAt}

            }).sort({createdAt : -1}).limit(20)
            .populate('sender',' username _id')
            .populate('receiver','username _id');
    }else{
            Oldermessages = await messageModel.find(
            {
                conversation : req.params.conversationId,

            }).sort({createdAt : -1}).limit(20)
            .populate('sender',' username _id')
            .populate('receiver','username _id');
    }
    console.log("All message sent");
    // console.log(Oldermessages);
    return res.json(Oldermessages);
})

module.exports = router ;