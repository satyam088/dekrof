const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const uploadToCloudinary = async (req, res, next) => {
     req.images = [];
    if(req.file){
        if(req.user.profilepic.url && req.user.profilepic.url !== process.env.USER_DEFAULT_PIC){
            await cloudinary.uploader.destroy(req.user.profilepic.filename);
        }
        const result = await cloudinary.uploader.upload(
            req.file.path,
            {
                folder: 'dekrof/posts',
                format: "webp"
            }
        );
        req.image = {
             url : result.secure_url ,
              filename : result.public_id
            };
        fs.unlinkSync(req.file.path);
        return next() ;
    }
    if (!req.files || req.files.length === 0) {
        return next();
    }
    for (const file of req.files) {
        try{
            const result = await cloudinary.uploader.upload(
                file.path,
                {
                    folder: 'dekrof/posts',
                    format: "webp"
                }
            );
            req.images.push({
            url: result.secure_url,
            filename: result.public_id
        });
        fs.unlinkSync(file.path);

        }catch(err){
            // console.log(err);
            console.log(err.message);
            console.log("Failed File : ",file.originalname);
        }
       
    }
    next();
};

module.exports = uploadToCloudinary;