const router = require("express").Router();
const controller = require("../controllers/auth.controller");
const upload = require("../middleware/upload");

router.post("/register", controller.register);
router.get("/login", controller.login);
router.post("/forgetPassword", controller.forgetPassword);
router.patch("/resetPassword/:token", controller.resetPassword);
router.get("/logout", controller.logout);

module.exports = router;
  