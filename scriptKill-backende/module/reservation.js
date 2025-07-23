const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    // 关联用户
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    // 关联店铺
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shop",
      required: true,
    },
    // 关联剧本
    script: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "script",
      required: true,
    },
    // 关联DM
    dm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "dm",
    },
    // 预约时间
    reservationTime: { type: Date, required: true },
    // 玩家及所选角色
    players: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        role: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "scriptRole",
        },
      },
    ],
    // 订单状态: 'pending'(待支付), 'confirmed'(已确认), 'playing'(游戏中), 'completed'(已完成), 'cancelled'(已取消)
    status: {
      type: String,
      enum: ["pending", "confirmed", "playing", "completed", "cancelled"],
      default: "pending",
    },
    // 总金额
    totalPrice: Number,
    // 备注
    notes: String,
  },
  {
    timestamps: true,
  }
);

const ReservationModel = mongoose.model("reservation", reservationSchema, "reservation");

module.exports = { ReservationModel };