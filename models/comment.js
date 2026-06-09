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
    likes :[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'user',
        }
    ],
    replies :[
        {
           type :  mongoose.Schema.Types.ObjectId,
           ref : 'comment',
        }
    ]
});


module.exports = mongoose.model('comment',commentSchema);