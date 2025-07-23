const mongoose = require('mongoose');

// 发起拼车模型
const InitiateCarSchema = new mongoose.Schema({
  script: { 
    name: { type: String, required: true },
    image: { type: String, default: '/堂主.png' },
    score: { type: Number, default: 8.0 },
    price: { type: Number, required: true },
    duration: { type: Number, required: true }, // 单位：分钟
    tags: [String],
    level: { type: String, enum: ['入门', '进阶', '高级'], default: '进阶' },
    // 新增剧本简介字段
    introduction: { type: String }
  },
  date: { type: Date, required: true },
  timeSlot: {
    start: { type: String, required: true }, // 格式：HH:mm
    end: { type: String, required: true }    // 格式：HH:mm
  },
  maxPeople: { type: Number, required: true },
  requirements: {
    male: { type: Number, required: true },
    female: { type: Number, required: true }
  },
  currentPeople: [{ 
    user: {
      _id: { type: mongoose.Schema.Types.ObjectId, required: true },
      avatar: { type: String, default: '/堂主.png' }
    },
    gender: { type: String, enum: ['male', 'female'], required: true }
  }],
  creator: {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    avatar: { type: String, default: '/堂主.png' }
  },
  status: { type: String, enum: ['pending', 'full', 'closed'], default: 'pending' },
  heat: { type: Number, default: 0 },
  fillRate: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// 添加中间件自动计算填充率
InitiateCarSchema.pre('save', function(next) {
  this.fillRate = (this.currentPeople.length / this.maxPeople) * 100;
  next();
});

module.exports = mongoose.model('InitiateCar', InitiateCarSchema);