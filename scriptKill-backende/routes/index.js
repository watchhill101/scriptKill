var express = require("express");
var router = express.Router();
const {
  UserModel, //用户
  ShopModel, //店铺
  ScriptModel, //剧本
  DmModel, //DM
  typeModel, //类型
  ReservationModel, //预约
  ScriptRoleModel, //角色
  PersonalCenterModel, //个人中心
} = require("../module/index");
//获取剧本
router.get("/script", (req, res) => {
  ScriptModel.find().then((data) => {
    res.json({
      code: 200,
      msg: "获取剧本成功",
      data,
    });
  });
});
//获取类型
router.get("/type", (req, res) => {
  typeModel.find().then((data) => {
    res.json({
      code: 200,
      msg: "获取类型成功",
      data,
    });
  });
});
//获取店铺
router.get("/shop", (req, res) => {
  ShopModel.find().then((data) => {
    res.json({
      code: 200,
      msg: "获取店铺成功",
      data,
    });
  });
});
//获取个人中心
router.get("/personal", (req, res) => {
  PersonalCenterModel.find().then((data) => {
    res.json({
      code: 200,
      msg: "获取个人中心成功",
      data,
    });
  });
});
//获取角色
router.get("/role", (req, res) => {
  ScriptRoleModel.find().then((data) => {
    res.json({
      code: 200,
      msg: "获取角色成功",
      data,
    });
  });
});
//获取预约
router.get("/reservation", (req, res) => {
  ReservationModel.find().then((data) => {
    res.json({
      code: 200,
      msg: "获取预约成功",
      data,
    });
  });
});
//获取DM
router.get("/dm", (req, res) => {
  DmModel.find().then((data) => {
    res.json({
      code: 200,
      msg: "获取DM成功",
      data,
    });
  });
});

module.exports = router;
