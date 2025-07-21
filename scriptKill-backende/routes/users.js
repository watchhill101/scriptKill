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
//登录
router.post("/user", (req, res) => {
  const { name, phone } = req.body;
  try {
    UserModel.find({ name, phone }).then((data) => {
      res.json({
        code: 200,
        msg: "登录成功",
        data: data[0]._id,
      });
    });
  } catch (err) {
    res.json({
      code: 500,
      msg: "登录失败",
      data: err,
    });
  }
});

module.exports = router;
