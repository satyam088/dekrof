const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const connectDb = require('./config/db');
const userModel = require("./models/user");

require('dotenv').config();
connectDb();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.set('view engine','ejs');
app.use(cookieParser());

app.get('/',(req, res)=>{
    res.send("ok");
});


app.listen(3000 , ()=>{ console.log("Server running")});