const multer = require("multer");
const ApiError = require("../utils/apiError");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/imgs/users");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${Math.round(Math.random() * 1e9)}-${Date.now()}.${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image"))
    return cb(new ApiError("Not an Image", 400), false);
  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted
  // To reject this file pass `false`, like so:
  // cb(null, false)

  // To accept the file pass `true`, like so:
  cb(null, true);
  // You can always pass an error if something goes wrong:
  // cb(new Error('I don\'t have a clue!'))
}
module.exports = multer({ storage, fileFilter });
