const multer = require("multer");
const ApiError = require("../utils/apiError");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    switch (req.baseUrl) {
      case "/categories":
        cb(null, "public/imgs/categories");
        break;
      // case '/users':
      //   cb(null, "public/imgs/users");
      // break;
      case "/products":
        cb(null, "public/imgs/products");
      default:
        break;
    }
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    switch (req.baseUrl) {
      case "/categories":
        cb(
          null,
          `category-${Math.round(Math.random() * 1e9)}-${Date.now()}.${ext}`
        );
        break;
      // case "/users":
      //   cb(
      //     null,
      //     `user-${Math.round(Math.random() * 1e9)}-${Date.now()}.${ext}`
      //   );
      //   break;
      case "/products":
        cb(
          null,
          `product-${Math.round(Math.random() * 1e9)}-${Date.now()}.${ext}`
        );
      default:
        break;
    }
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image"))
    return cb(new ApiError("Not an Image", 400), false);
  cb(null, true);
};
module.exports = multer({ storage, fileFilter });
