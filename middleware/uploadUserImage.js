const sharp = require("sharp");
const multer = require("multer");

const fileStorage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image"))
    return cb(new ApiError("Not an Image", 400), false);
  cb(null, true);
};
exports.upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
});

exports.resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${Math.round(
    Math.random() * 1e9
  )}-${Date.now()}.jpeg`;
  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/imgs/users/${req.file.filename}`);
  next();
};
