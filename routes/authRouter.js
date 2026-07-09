const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userModel = require("../models/user");
const postModel = require("../models/post");
const commentModel = require("../models/comment");

router.get('/login',(req,res)=>{
    return res.render('login');
});
router.get('/register',(req, res)=>{
    return res.render('register');
});

router.get('/logout',(req, res)=>{
    res.cookie("token","");
    res.redirect('login')
});

router.post('/login', async (req, res)=>{
    let {email , password} = req.body;
    let user = await userModel.findOne({email}).select('-followers -following');
    if(user === null){
        return res.render('login',{msg : "No User Found"});
    }else{
        let validity = await bcrypt.compare(password ,user.password);
        if(validity){
            let token = jwt.sign({email , userid : user._id , username : user.username}, process.env.JWT_KEY);
            res.cookie("token",token);
            return res.redirect('/');
        }else{
            return res.render('login',{msg : "Incorrect Password"});
        }
    }
});

module.exports = router ;