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
  const { playerCount, difficulty, tags } = req.query;
  
  // 构建查询条件
  let query = {};
  
  // 人数筛选 - 假设数据库中存储的是总人数字段
  if (playerCount && playerCount.length > 0) {
    const playerCounts = Array.isArray(playerCount) ? playerCount : [playerCount];
    const countConditions = playerCounts.map(count => {
      if (count === '12+') {
        return { $expr: { $gte: [{ $add: ['$recommendNum.boyNum', '$recommendNum.grilNum'] }, 12] } };
      } else {
        const num = parseInt(count.replace('人', ''));
        return { $expr: { $eq: [{ $add: ['$recommendNum.boyNum', '$recommendNum.grilNum'] }, num] } };
      }
    });
    query.$or = countConditions;
  }
  
  // 难度筛选 - 假设数据库中有difficulty字段
  if (difficulty && difficulty.length > 0) {
    const difficulties = Array.isArray(difficulty) ? difficulty : [difficulty];
    query.difficulty = { $in: difficulties };
  }
  
  // 标签筛选 - 通过type字段筛选
  if (tags && tags.length > 0) {
    const tagArray = Array.isArray(tags) ? tags : [tags];
    // 先查询匹配的类型ID
    TypeModel.find({ name: { $in: tagArray } })
      .then(types => {
        const typeIds = types.map(type => type._id);
        if (typeIds.length > 0) {
          query.type = { $in: typeIds };
        }
        
        return ScriptModel.find(query)
          .populate('type', 'name')
          .populate('role', 'name gender description imgUrl');
      })
      .then((data) => {
        res.json({
          code: 200,
          msg: "获取剧本成功",
          data,
        });
      })
      .catch((error) => {
        res.json({
          code: 500,
          msg: "获取剧本失败",
          error: error.message,
        });
      });
    return;
  }
  
  // 如果没有标签筛选，直接查询
  ScriptModel.find(query)
    .populate('type', 'name')
    .populate('role', 'name gender description imgUrl')
    .then((data) => {
      res.json({
        code: 200,
        msg: "获取剧本成功",
        data,
      });
    })
    .catch((error) => {
      res.json({
        code: 500,
        msg: "获取剧本失败",
        error: error.message,
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
