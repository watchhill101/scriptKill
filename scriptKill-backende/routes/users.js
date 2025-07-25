var express = require("express");
var router = express.Router();
const {
  UserModel, //用户
} = require("../module/index");

// 登录
router.post("/login", async (req, res) => {
  const { phone } = req.body;
  try {
    const data = await UserModel.find({ phone });
    if (data && data.length > 0) {
      // 返回完整的用户信息
      const user = data[0];
      res.json({
        code: 200,
        msg: "登录成功",
        _id: user._id,
        openId: user.openId,
        name: user.name,
        imgUrl: user.imgUrl,
        phone: user.phone,
        sex: user.sex,
        balance: user.balance || 0,
        points: user.points || 0
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

// 注册
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
      name: data[0].name,
      sex: data[0].sex,
      imgUrl: data[0].imgUrl
    });
  } catch (err) {
    console.error("注册错误:", err);
    res.json({
      code: 500,
      msg: "服务器错误",
    });
  }
});

// 获取用户资料
router.get("/profile/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.json({
        code: 404,
        msg: "用户不存在"
      });
    }
    
    res.json({
      code: 200,
      msg: "获取用户资料成功",
      data: {
        _id: user._id,
        name: user.name,
        imgUrl: user.imgUrl,
        phone: user.phone,
        sex: user.sex,
        collections: user.collections || [],
        playedBefore: user.playedBefore || [],
        coupons: user.coupons || [],
        balance: user.balance || 0,
        points: user.points || 0,
        openId: user.openId
      }
    });
  } catch (err) {
    console.error("获取用户资料错误:", err);
    res.json({
      code: 500,
      msg: "服务器错误"
    });
  }
});

// 获取钱包信息
router.get("/wallet/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.json({
        code: 404,
        msg: "用户不存在"
      });
    }
    
    res.json({
      code: 200,
      msg: "获取钱包信息成功",
      data: {
        balance: user.balance || 0.00,
        points: user.points || 0,
      }
    });
  } catch (err) {
    console.error("获取钱包信息错误:", err);
    res.json({
      code: 500,
      msg: "服务器错误"
    });
  }
});

// 充值
router.post("/recharge", async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.json({
        code: 404,
        msg: "用户不存在"
      });
    }
    
    // 计算奖励积分 (充值金额的10%)
    const bonusPoints = Math.floor(amount * 0.1);
    
    // 更新余额和积分
    user.balance = (user.balance || 0) + amount;
    user.points = (user.points || 0) + bonusPoints;
    
    // 记录交易
    const transaction = {
      type: "recharge",
      amount: amount,
      date: new Date(),
      bonusPoints: bonusPoints
    };
    
    if (!user.transactions) {
      user.transactions = [];
    }
    user.transactions.push(transaction);
    
    await user.save();
    
    res.json({
      code: 200,
      msg: "充值成功",
      data: {
        balance: user.balance,
        points: user.points,
        bonusPoints: bonusPoints
      }
    });
  } catch (err) {
    console.error("充值错误:", err);
    res.json({
      code: 500,
      msg: "服务器错误"
    });
  }
});

// 消费
router.post("/spend", async (req, res) => {
  try {
    const { userId, amount, purpose } = req.body;
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.json({
        code: 404,
        msg: "用户不存在"
      });
    }
    
    if ((user.balance || 0) < amount) {
      return res.json({
        code: 400,
        msg: "余额不足"
      });
    }
    
    // 更新余额
    user.balance -= amount;
    
    // 记录交易
    const transaction = {
      type: "spend",
      amount: amount,
      purpose: purpose,
      date: new Date()
    };
    
    if (!user.transactions) {
      user.transactions = [];
    }
    user.transactions.push(transaction);
    
    await user.save();
    
    res.json({
      code: 200,
      msg: "消费成功",
      data: {
        balance: user.balance
      }
    });
  } catch (err) {
    console.error("消费错误:", err);
    res.json({
      code: 500,
      msg: "服务器错误"
    });
  }
});

// 添加积分
router.post("/addPoints", async (req, res) => {
  try {
    const { userId, points, source } = req.body;
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.json({
        code: 404,
        msg: "用户不存在"
      });
    }
    
    // 更新积分
    user.points = (user.points || 0) + points;
    
    // 记录积分变动
    const pointRecord = {
      type: "add",
      points: points,
      source: source,
      date: new Date()
    };
    
    if (!user.pointRecords) {
      user.pointRecords = [];
    }
    user.pointRecords.push(pointRecord);
    
    await user.save();
    
    res.json({
      code: 200,
      msg: "积分添加成功",
      data: {
        points: user.points
      }
    });
  } catch (err) {
    console.error("添加积分错误:", err);
    res.json({
      code: 500,
      msg: "服务器错误"
    });
  }
});

// 使用积分
router.post("/usePoints", async (req, res) => {
  try {
    const { userId, points, purpose } = req.body;
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.json({
        code: 404,
        msg: "用户不存在"
      });
    }
    
    if ((user.points || 0) < points) {
      return res.json({
        code: 400,
        msg: "积分不足"
      });
    }
    
    // 更新积分
    user.points -= points;
    
    // 记录积分变动
    const pointRecord = {
      type: "use",
      points: points,
      purpose: purpose,
      date: new Date()
    };
    
    if (!user.pointRecords) {
      user.pointRecords = [];
    }
    user.pointRecords.push(pointRecord);
    
    await user.save();
    
    res.json({
      code: 200,
      msg: "积分使用成功",
      data: {
        points: user.points
      }
    });
  } catch (err) {
    console.error("使用积分错误:", err);
    res.json({
      code: 500,
      msg: "服务器错误"
    });
  }
});

// 获取交易记录
router.get("/transactions/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.json({
        code: 404,
        msg: "用户不存在"
      });
    }
    
    res.json({
      code: 200,
      msg: "获取交易记录成功",
      data: user.transactions || []
    });
  } catch (err) {
    console.error("获取交易记录错误:", err);
    res.json({
      code: 500,
      msg: "服务器错误"
    });
  }
});

// 获取积分记录
router.get("/pointRecords/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.json({
        code: 404,
        msg: "用户不存在"
      });
    }
    
    res.json({
      code: 200,
      msg: "获取积分记录成功",
      data: user.pointRecords || []
    });
  } catch (err) {
    console.error("获取积分记录错误:", err);
    res.json({
      code: 500,
      msg: "服务器错误"
    });
  }
});

module.exports = router;
