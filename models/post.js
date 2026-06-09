const mongoose = require('mongoose');

let postSchema = mongoose.Schema({
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
    comments :[
        {
           type :  mongoose.Schema.Types.ObjectId,
           ref : 'comment',
        }
    ]
});


module.exports = mongoose.model('post',postSchema);