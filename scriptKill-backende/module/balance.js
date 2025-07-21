//余额模型
const mongoose = require("mongoose");

const BalanceSchema = new mongoose.Schema({
  //用户
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  //余额
  balance: {
    type: Number,
    default: 0,
  },
  //积分
  points: {
    type: Number,
    default: 0,
  },
});

const BalanceModel = mongoose.model("balance", BalanceSchema, "balance");

module.exports = BalanceModel;
