const mongoose = require('mongoose');

let commentSchema = mongoose.Schema({
    user :{
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'user',
    },
    date : {
        type : Date ,
        default : Date.now
    },
    content : {
        type : String,
    },
    post : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'post',
    }
});


module.exports = mongoose.model('comment',commentSchema);