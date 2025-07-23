var express = require("express");
var router = express.Router();
const {
  UserModel, //用户
} = require("../module/index");
//登录
router.post("/login", async (req, res) => {
  const { phone } = req.body;
  try {
    const data = await UserModel.find({ phone });
    if (data && data.length > 0) {
      res.json({
        code: 200,
        msg: "登录成功",
        openId: data[0].openId,
        _id: data[0]._id,
      });
    } else {
      res.json({
        code: 404,
        msg: "该用户不存在",
      });
    }
  } catch (err) {
    console.error("登录错误:", err);
    res.json({
      code: 500,
      msg: "服务器错误",
    });
  }
});
//注册
router.post("/register", async (req, res) => {
  const { phone, name, sex } = req.body;
  try {
    const newUser = new UserModel({
      phone,
      name,
      sex
    });
    await newUser.save();
    const data = await UserModel.find({ phone });
    res.json({
      code: 200,
      msg: "注册成功",
      _id: data[0]._id,
    });
  } catch (err) {
    console.error("注册错误:", err);
    res.json({
      code: 500,
      msg: "服务器错误",
    });
  }
});

module.exports = router;
