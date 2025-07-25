const mongoose = require("mongoose");
const config = require("config");

const connectDB = async () => {
  try {
    // 修改这一行，统一使用同一个大小写格式
    const mongoURI = "mongodb://127.0.0.1:27017/ScriptKill"; // 统一使用大写S的ScriptKill

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB 连接成功");
  } catch (err) {
    console.error("MongoDB 连接失败:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
