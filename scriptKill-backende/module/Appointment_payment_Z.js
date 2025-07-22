const mongoose  = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ScriptKill', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log('数据库连接成功');
}).catch((err) => {
  console.error('数据库连接失败', err);
});

// 定义用户模型
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// 定义门店模型
const ShopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  location: { // 经纬度
    type: { type: String, default: 'Point' },
    coordinates: [Number] // [lng, lat]
  },
  phone: { type: String },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

ShopSchema.index({ location: '2dsphere' });

// 定义剧本模型
const ScriptSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  originPrice: { type: Number },
  duration: { type: Number, required: true }, // 单位：分钟
  minPeople: { type: Number, required: true },
  maxPeople: { type: Number, required: true },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  tags: [String],
  description: { type: String },
  timeSlots: [
    {
      label: String, // "00:00~05:00"
      start: String, // "00:00"
      end: String,   // "05:00"
      price: Number
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

// 定义优惠券模型
const CouponSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  condition: { type: String }, // 满减条件
  expiredAt: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // 可为空，若为null则为通用券
  used: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// 定义预约订单模型
const AppointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  script: { type: mongoose.Schema.Types.ObjectId, ref: 'Script', required: true },
  people: { type: Number, required: true },
  date: { type: Date, required: true }, // 预约日期
  timeSlot: {
    label: { type: String, required: true }, // "00:00~05:00"
    start: { type: String }, // "00:00"
    end: { type: String }    // "05:00"
  },
  pricePerPerson: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
  couponAmount: { type: Number, default: 0 },
  remark: { type: String },
  phone: { type: String, required: true },
  status: { type: String, enum: ['pending', 'paid', 'cancelled', 'finished'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Shop = mongoose.model('Shop', ShopSchema);
const Script = mongoose.model('Script', ScriptSchema);
const Coupon = mongoose.model('Coupon', CouponSchema);
const Appointment = mongoose.model('Appointment', AppointmentSchema);

module.exports = {
  User,
  Shop,
  Script,
  Coupon,
  Appointment
};