const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String, //用户名
    imgUrl: String, //头像
    phone: String, //手机号
    openId: { type: String, unique: true }, // 微信用户唯一标识
    // 收藏的剧本
    collections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "script",
      },
    ],
    // 玩过的剧本
    playedBefore: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "script",
      },
    ],
    // 优惠券
    coupons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "coupon",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("user", userSchema, "user");

module.exports = { UserModel };
