const mongoose = require('mongoose');

// 发车信息模型
const CarGroupSchema = new mongoose.Schema({
  script: { 
    name: { type: String, required: true },
    image: { type: String, default: '/堂主.png' },
    score: { type: Number, default: 8.0 },
    price: { type: Number, required: true },
    duration: { type: Number, required: true }, // 单位：分钟
    tags: [String],
    level: { type: String, enum: ['入门', '进阶', '高级'], default: '进阶' },
    introduction: { type: String } // 新增剧本简介字段
  },
  maxPeople: { type: Number, required: true },
  requirements: {
    male: { type: Number, required: true },
    female: { type: Number, required: true }
  },
  date: { type: Date, required: true },
  timeSlot: {
    start: { type: String, required: true }, // 格式：HH:mm
    end: { type: String, required: true }    // 格式：HH:mm
  },
  currentPeople: [{ 
    user: {
      _id: { type: mongoose.Schema.Types.ObjectId, required: true },
      avatar: { type: String, default: '/堂主.png' }
    },
    gender: { type: String, enum: ['male', 'female'], required: true }
  }],
  status: { type: String, enum: ['pending', 'full', 'closed'], default: 'pending' },
  heat: { type: Number, default: 0 },      // 热度值
  fillRate: { type: Number, default: 0 },  // 填充率
  createdAt: { type: Date, default: Date.now }
});

// 添加中间件自动计算填充率
CarGroupSchema.pre('save', function(next) {
  // 计算填充率
  this.fillRate = (this.currentPeople.length / this.maxPeople) * 100;
  
  // 更新状态
  if (this.currentPeople.length >= this.maxPeople) {
    this.status = 'full';
  }
  
  next();
});

module.exports = mongoose.model('CarGroup', CarGroupSchema);