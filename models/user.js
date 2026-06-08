const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    username : String ,
    name : String ,
    age : Number  ,
    email : String ,
    password : String,
});


module.exports = mongoose.model('user',userSchema);