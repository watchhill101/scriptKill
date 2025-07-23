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
