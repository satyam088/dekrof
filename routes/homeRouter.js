const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userModel = require("../models/user");
const postModel = require("../models/post");
const commentModel = require("../models/comment");

router.get('/' ,isLoggedIn , async(req, res)=>{
    let useremail = req.user.email;
    let user = await userModel.findOne({email : useremail});
    let posts = await postModel.find().limit(10).populate('user');
    return res.render('index',{user , posts });
}); 






module.exports = router ;