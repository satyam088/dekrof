const mongoose = require('mongoose');

let messageSchema = mongoose.Schema({
    conversation : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'conversation'
    },
    sender :{
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'user',
    },
    receiver :{
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'user',
    },
    message : {
        type : String,
    },
    seen :{
        type : Boolean,
        default : false
    }
}, {timestamps : true});


module.exports = mongoose.model('message',messageSchema);