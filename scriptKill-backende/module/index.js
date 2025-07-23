const db = require("mongoose");
const { UserModel } = require("./user");
const { ShopModel } = require("./shop");
const { ScriptModel } = require("./script");
const { DmModel } = require("./dm");
const { TypeModel } = require("./type");
const { ReservationModel } = require("./reservation");
const { ScriptRoleModel } = require("./scriptRole");
const { PersonalCenterModel } = require("./personalCenter");
const { CouponModel} = require('./coupon');

const { BalanceModel } = require("./balance");


db.connect("mongodb://127.0.0.1:27017/scriptKill")
  .then(() => {
    console.log("数据库连接成功");
  })
  .catch((err) => {
    console.log("数据库连接失败", err);
  });

module.exports = {
  UserModel,
  ShopModel,
  ScriptModel,
  DmModel,  
  TypeModel,
  ReservationModel,
  ScriptRoleModel,
  PersonalCenterModel,
  CouponModel,
  BalanceModel,
};
