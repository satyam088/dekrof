const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');

const messageModel = require('../models/message');
const conversationModel = require('../models/conversation');

router.get('/get/:conversationId/:lastMessageId' , isLoggedIn , async(req , res)=>{
    console.log("Are bauji msg mang rha hai");
    let conversation = await conversationModel.findOne({
        _id : req.params.conversationId,
        participants: req.user._id
    });
    if(!conversation){
        console.log(req.params.conversationId);
        return res.send("Unauthrized access");
    }
    let lastMessage ;
    if(req.params.lastMessageId!=="abc"){
        lastMessage = await messageModel.findOne({
            _id : req.params.lastMessageId,
            conversation: req.params.conversationId
        });
        let Oldermessages;
    }
    if(lastMessage){
             Oldermessages = await messageModel.find(
            {
                conversation : req.params.conversationId,
                _id: { $lt: lastMessage._id }

            }).sort({_id : -1}).limit(20)
            .populate('sender',' username _id')
            .populate('receiver','username _id');
    }else{
            Oldermessages = await messageModel.find(
            {
                conversation : req.params.conversationId,

            }).sort({_id : -1}).limit(20)
            .populate('sender',' username _id')
            .populate('receiver','username _id');
    }
    // console.log(req.params.lastMessageId);
    console.log("All message sent");
    // console.log(Oldermessages);
    return res.json(Oldermessages);
})

module.exports = router ;