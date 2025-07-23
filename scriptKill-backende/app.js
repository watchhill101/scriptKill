var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var indexZRouter = require('./routes/index_Z');

var app = express();
// 导入数据库连接和路由
var connectDB = require('./config/db');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var rankingRouter = require('./routes/ranking'); // 新增排行榜路由

// 连接数据库
connectDB();


app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 修改路由配置顺序
app.use('/index_Z', indexZRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/rankings', rankingRouter); // 新增排行榜API路由

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
