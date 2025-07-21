const mongoose = require("mongoose");

const dmSchema = new mongoose.Schema(
  {
    name: String, // DM姓名
    imgUrl: String, // DM头像
    description: String, // DM简介
    // 所属店铺
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shop",
    },
  },
  {
    timestamps: true,
  }
);

const DmModel = mongoose.model("dm", dmSchema, "dm");

module.exports = { DmModel };