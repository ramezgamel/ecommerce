const router = require("express").Router();
const controller = require("../controllers/user.controller");
const auth = require("../middleware/auth.middleware")

router
  .route("/")
  .get(auth.protect, auth.restrictTo("admin"), controller.getAllUser)
  .post(controller.createUser)
  .patch(auth.protect, controller.updateProfile)
  .delete(auth.protect, controller.deleteMe);

// this for admin to controller on user
router
  .route("/:id")
  .get(auth.protect,controller.getOne)
  .delete(auth.protect,auth.restrictTo("admin"),controller.deleteOne);

module.exports = router;
