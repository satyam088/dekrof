const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    username : {
        type : String , 
        unique : true
    },
    name : String ,
    age : Number  ,
    email : {
        type : String ,
        unique : true
    },
    password : String,
    posts : [
        {
            type : mongoose.Schema.Types.ObjectId ,
            ref : 'post',
        }
    ]
});


module.exports = mongoose.model('user',userSchema);