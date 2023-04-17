const router = require("express").Router();
const controller = require("../controllers/category.controller");
const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload");

router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.use(auth.protect, auth.restrictTo("admin", "seller"));
router.delete("/:id", controller.deleteOne);
router.use(upload.single("image"));
router.post("/", controller.createOne);
router.patch("/:id", controller.updateOne);

module.exports = router;
