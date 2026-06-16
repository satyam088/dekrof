const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    username : {
        type : String , 
        unique : true
    },
    profilepic : {
        type : String , 
        default : "default.webp"
    },
    name : String ,
    age : Number  ,
    email : {
        type : String ,
        unique : true
    },
    password : String,
});


module.exports = mongoose.model('user',userSchema);