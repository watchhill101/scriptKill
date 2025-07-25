const express = require('express');
const router = express.Router();
// 将大写C改为小写c
const CouponModel = require('../module/coupon');

// 获取所有优惠券
router.get('/', async (req, res) => {
  try {
    const coupons = await CouponModel.find();
    res.json({
      code: 200,
      msg: '获取优惠券成功',
      data: coupons
    });
  } catch (err) {
    console.error('优惠券查询失败:', err);
    res.status(500).json({
      code: 500,
      msg: '服务器错误: ' + err.message
    });
  }
});

module.exports = router;