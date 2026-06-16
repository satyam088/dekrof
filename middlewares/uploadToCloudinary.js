const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const uploadToCloudinary = async (req, res, next) => {

    req.images = [];

    if (!req.files || req.files.length === 0) {
        return next();
    }

    for (const file of req.files) {

        const result = await cloudinary.uploader.upload(
            file.path,
            {
                folder: 'dekrof/posts'
            }
        );

        req.images.push({
            url: result.secure_url,
            filename: result.public_id
        });

        fs.unlinkSync(file.path);
    }

    next();
};

module.exports = uploadToCloudinary;