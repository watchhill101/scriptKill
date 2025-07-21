const mongoose = require("mongoose");

const scriptRoleSchema = new mongoose.Schema({
  name: String, // 角色名称
  gender: String, // 角色性别 (男/女/不限)
  description: String, // 角色简介
  imgUrl: String, // 角色图片
});

const ScriptRoleModel = mongoose.model("scriptRole", scriptRoleSchema, "scriptRole");

module.exports = { ScriptRoleModel };