//优惠卷模型
const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema({
  //用户
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  //优惠卷名称
  name: {
    type: String,
    default: "",
  },
  //优惠卷金额
  amount: {
    type: Number,
    default: 0,
  },
  //优惠卷过期时间
  expire: {
    type: Date,
    default: Date.now,
  },
  //优惠卷状态
  status: {
    type: Number,
    enum: [0, 1, 2],//0:未使用 1:已使用 2:已过期
    default: 0,
  },
});

const CouponModel = mongoose.model("coupon", CouponSchema, "coupon");

module.exports = CouponModel;
