const router = require("express").Router();
const controller = require("../controllers/category.controller");
const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload")

router
  .route("/")
  .get(auth.protect, controller.getAll)
  .post(upload.single('image'),auth.protect, auth.restrictTo("admin", "seller"), controller.createOne);
router
  .route("/:id")
  .get(auth.protect, controller.getOne)
  .patch(auth.protect, auth.restrictTo("admin", "seller"), controller.updateOne)
  .delete(
    auth.protect,
    auth.restrictTo("admin", "seller"),
    controller.deleteOne
  );

module.exports = router;
