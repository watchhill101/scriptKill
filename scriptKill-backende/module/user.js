const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String, //用户名
    imgUrl: {
      type: String,
      default: "https://robohash.org/default.png",
    }, //头像
    phone: String, //手机号
    sex: {
      type: Number,
      enum: [0, 1], // 0-女 1-男
      default: 0,
    }, //性别
    openId: {
      type: String,
      unique: true,
      default: function () {
        // 生成类似微信 openId 格式的唯一标识
        return (
          "o" +
          Date.now().toString(36) +
          Math.random().toString(36).substr(2, 9)
        );
      },
    }, // 微信用户唯一标识
    // 收藏的剧本
    collections: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "script",
        },
      ],
      default: [],
    },
    // 玩过的剧本
    playedBefore: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "script",
        },
      ],
      default: [],
    },
    // 优惠券
    coupons: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "coupon",
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("user", userSchema, "user");

module.exports = { UserModel };
