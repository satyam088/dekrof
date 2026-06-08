const mongoose = require('mongoose');
async function connectDb (){
    try{
        await mongoose.connect(process.env.mongodbURL);
        console.log("Connected To DB");
    }catch(err){

        console.log("Not connected to DB");
    }
}

module.exports = connectDb ;