var express = require("express");
var router = express.Router();



const rankingRouter = require('./ranking');
// 添加优惠券路由导入
const couponRouter = require('./coupon');
const {
  ShopModel, //店铺
  ScriptModel, //剧本
  DmModel, //DM
  TypeModel, //类型
  ReservationModel, //预约
  ScriptRoleModel, //角色
  PersonalCenterModel, //个人中心
  CouponModel, //优惠券
  BalanceModel, //余额
} = require("../module/index");

// 添加排名路由挂载
router.use('/api/rankings', rankingRouter);
// 在文件末尾添加优惠券路由挂载
router.use('/api/coupons', couponRouter);
// 挂载排名路由
router.use('/api/rankings', rankingRouter);

// 获取剧本
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
  TypeModel.find().then((data) => { 
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
//获取优惠券
router.get('/coupon', (req, res) => {
  CouponModel.find().then((data) => {
    res.json({
      code: 200,
      msg: "获取优惠券成功",
      data,
    });
  });
});
//获取余额
router.get('/balance', (req, res) => {
  BalanceModel.find().then((data) => {
    res.json({
      code: 200,
      msg: "获取余额成功",
      data,
    });
  });
})

module.exports = router;
