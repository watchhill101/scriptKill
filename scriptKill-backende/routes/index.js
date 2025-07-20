var express = require("express");
var router = express.Router();
// const {
//   UserModel,
//   ShopModel,
//   ScriptModel,
//   DmModel,
//   CouponModel,
//   ReservationModel,
//   ScriptRoleModel,
//   PersonalCenterModel,
// } = require("../module/index");
require('../module/index')

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
