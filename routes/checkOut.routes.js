const router = require("express").Router();
const auth = require('../middleware/auth.middleware');
const controller = require("../controllers/checkOut.controller");

router.get(
  "/checkOut-session/:id",
  auth.protect,
  controller.getCheckOutSession
);

module.exports = router