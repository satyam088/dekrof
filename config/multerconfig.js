const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname ,'../public/images/uploads'));
  },
  filename: function (req, file, cb) {
        fn = Date.now() + path.extname(file.originalname);
        cb(null, fn);
  }
})

const upload = multer({ storage: storage });

module.exports = upload ;