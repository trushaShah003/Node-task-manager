const multer = require("multer");

const avatar = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error("please upload a jpg, jpeg or png file"));
    }
    cb(undefined, true);
  },
});

module.exports = avatar;
