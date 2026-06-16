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
    images : {
        type : [imageSchema],
        default :[]
    } ,
    content : {
        type : String,
    },
    likes :[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'user',
        }
    ],
    likeCount:{
        type : Number,
        default : 0
    },
    commentCount : {
        type :Number,
        default : 0
    }
} , {timestamps: true});


module.exports = mongoose.model('post',postSchema);