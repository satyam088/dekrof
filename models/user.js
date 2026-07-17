const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: String,
  filename: String
}, {_id : false});

let userSchema = mongoose.Schema({
    username : {
        type : String , 
        unique : true
    },
    profilepic : imageSchema,
    name : String ,
    age : Number  ,
    email : {
        type : String ,
        unique : true
    },
    password : String,
    followers :[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'user',
        }
    ],
    followerCount :{
        type : Number ,
        default : 0,
    },
    following : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'user',
        }
    ],
    followingCount :{
        type : Number ,
        default : 0,
    },
    postCount :{
        type : Number ,
        default : 0,
    },
    bio : String 

},{
    timestamps: true
});


module.exports = mongoose.model('user',userSchema);