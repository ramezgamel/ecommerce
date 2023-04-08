const router = require("express").Router();
const controller = require("../controllers/auth.controller");
const { upload, resizeUserPhoto } = require("../middleware/uploadUserImage");

router.post(
  "/register",
  upload.single("profileImg"),
  resizeUserPhoto,
  controller.register
);
router.get("/login", controller.login);
router.post("/forgetPassword", controller.forgetPassword);
router.patch("/resetPassword/:token", controller.resetPassword);
router.get("/logout", controller.logout);

module.exports = router;
  