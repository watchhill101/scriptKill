var express = require("express");
var router = express.Router();
const {
  UserModel, //用户
} = require("../module/index");
//登录
router.post("/login", (req, res) => {
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
