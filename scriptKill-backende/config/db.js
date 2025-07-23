const mongoose = require('mongoose');
require('dotenv').config();

// 检查是否已存在连接，避免重复连接
const connectDB = async () => {
  try {
    // 如果已有活跃连接，则直接返回
    if (mongoose.connection.readyState >= 1) {
      console.log('MongoDB已连接，无需重复连接');
      return;
    }

    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/scriptKill', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB连接成功');
  } catch (err) {
    console.error('MongoDB连接失败:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;