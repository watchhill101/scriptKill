const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// 导入数据库连接
const connectDB = require('./config/db');

// 导入路由
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const indexZRouter = require('./routes/index_Z'); // 添加Z组API路由

const app = express();

// 连接数据库
connectDB();

// CORS 配置
app.use(cors());

// 视图引擎设置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// 中间件
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 路由
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/z', indexZRouter); // 挂载Z组API路由

// 捕获 404 并转发到错误处理器
app.use(function(req, res, next) {
  next(createError(404));
});

// 错误处理器
app.use(function(err, req, res, next) {
  // 设置局部变量，只在开发环境提供错误信息
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // 渲染错误页面
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;