const cloudinary = require("../config/cloudinary");
const uploadBuffer = require("../utils/uploadBufferCloudinary");
// this code is written by AI , cause I don't had the time for changing whole code from disk storage to memory storage
const uploadToCloudinary = async (req, res, next) => {
    req.images = [];

    try {

        if (req.file) {

            if (
                req.user?.profilepic?.url &&
                req.user.profilepic.url !== process.env.USER_DEFAULT_PIC
            ) {
                await cloudinary.uploader.destroy(req.user.profilepic.filename);
            }

            const result = await uploadBuffer(req.file.buffer, {
                folder: "dekrof/posts",
                format: "webp",
            });

            req.image = {
                url: result.secure_url,
                filename: result.public_id,
            };

            return next();
        }

        if (!req.files || req.files.length === 0) {
            return next();
        }
        const uploadPromises = req.files.map(file =>
            uploadBuffer(file.buffer, {
                folder: "dekrof/posts",
                format: "webp",
            })
        );
        const results = await Promise.allSettled(uploadPromises);
        results.forEach((result, index) => {
            if (result.status === "fulfilled") {
                req.images.push({
                    url: result.value.secure_url,
                    filename: result.value.public_id,
                });
            } else {
                console.error(result.reason.message);
                console.log("Failed File:", req.files[index].originalname);
            }
        });
        next();

    } catch (err) {
        next(err);
    }
};

module.exports = uploadToCloudinary;