const cloudinary = require('../config/cloudinary');


const  deleteFromCloudinary = async (profilepic)=>{
    if(profilepic && profilepic.url != process.env.USER_DEFAULT_PIC){
        await cloudinary.uploader.destroy(profilepic.filename);
        return ;
    }
    return ;
}
module.exports = deleteFromCloudinary ;



