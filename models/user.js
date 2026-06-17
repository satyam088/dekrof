const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    username : {
        type : String , 
        unique : true
    },
    profilepic : {
        type : String , 
        default : 'https://res.cloudinary.com/dafdap5cr/image/upload/q_auto/f_auto/v1781707471/default_rbs439.webp',
    },
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
    }

});


module.exports = mongoose.model('user',userSchema);