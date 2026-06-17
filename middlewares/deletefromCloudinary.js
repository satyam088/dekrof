const cloudinary = require('../config/cloudinary');


const  deleteFromCloudinary = async (urlLink)=>{
    if(urlLink && urlLink != process.env.USER_DEFAULT_PIC){
        await cloudinary.uploader.destroy(urlLink);
        return ;
    }
    return ;
}
module.exports = deleteFromCloudinary ;



