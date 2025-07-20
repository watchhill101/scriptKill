const mongoose = require("mongoose");

const scriptSchema = new mongoose.Schema(
  {
    name: String, //剧本名称
    imgUrl: String, //剧本图片
    price: Number, //剧本价格
    description: String, //剧本描述
    //剧本类型
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "type",
      },
    ],
    //剧本推荐人数
    recommendNum: { grilNum: Number, boyNum: Number },
    //剧本时长
    duration: String,
    //剧本角色reservation
    role: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "scriptRole",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ScriptModel = mongoose.model("script", scriptSchema, "script");
module.exports = { ScriptModel };
