const mongoose = require('mongoose');

const rankingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  points: {
    type: Number,
    required: true,
    default: 0
  },
  avatar: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 添加按分数排序的索引
rankingSchema.index({ points: -1 });

module.exports = mongoose.model('Ranking', rankingSchema);