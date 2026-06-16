const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function isLoggedIn(req ,res , next){
    let token = req.cookies.token ;
    try{
        let data = await jwt.verify(token, process.env.JWT_KEY);
        req.user = data ;
        return next();
    }catch(err){
        return res.render('register');
    }
}

module.exports = isLoggedIn ;