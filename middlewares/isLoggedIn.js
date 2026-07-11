const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require("../models/user");

async function isLoggedIn(req ,res , next){
    let token = req.cookies.token ;
    try{
        let data = await jwt.verify(token, process.env.JWT_KEY);
        let user = await userModel.findOne({email : data.email}).select('username name profilepic email _id');
        req.user = user;
        return next();
    }catch(err){
        return res.redirect('/auth/register');
    }
}

module.exports = isLoggedIn ;