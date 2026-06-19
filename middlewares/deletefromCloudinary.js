const cloudinary = require('../config/cloudinary');


const  deleteFromCloudinary = async (images)=>{
    if(!(images instanceof Array)){
        if(images && images.url != process.env.USER_DEFAULT_PIC){
            try{
                await cloudinary.uploader.destroy(images.filename);
            }catch(err){
                console.log("single file",err.message);
            }
            return ;
        }
    }else if(images.length >1){
        for(let image of images){
            try{
                await cloudinary.uploader.destroy(image.filename);
            }catch(err){
                console.log("multiple file ",err.msg);
            }
        };
    }
    return ;
}
module.exports = deleteFromCloudinary ;



