const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
  {
    name: String, //店铺名称
    imgUrl: String, //店铺头像
    phone: String, //店铺手机号
    address: String, //店铺地址
    //营业时间
    businessHours: String,
    // 店铺拥有的剧本
    scripts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "script",
      },
    ],
    // 店铺的DM
    dms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "dm",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ShopModel = mongoose.model("shop", shopSchema, "shop");

module.exports = { ShopModel };
