var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(cors())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());

// 模拟用户数据（内存，重启会丢失）
const users = [
  { username: 'test', password: '123456' },
  { username: 'admin', password: 'admin' }
];

// 模拟店铺数据
const shops = [
  { id: 1, name: '剧本杀A店', lat: 31.2304, lng: 121.4737 },
  { id: 2, name: '剧本杀B店', lat: 31.2204, lng: 121.4637 },
  { id: 3, name: '剧本杀C店', lat: 31.2404, lng: 121.4837 }
];

// 计算两点间距离
function getDistance(lat1, lng1, lat2, lng2) {
  const toRad = v => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 注册接口
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.json({ success: false, message: '用户名和密码不能为空' });
  }
  const exist = users.find(u => u.username === username);
  if (exist) {
    return res.json({ success: false, message: '用户名已存在' });
  }
  users.push({ username, password });
  res.json({ success: true, message: '注册成功' });
});

// 登录接口
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ success: true, message: '登录成功' });
  } else {
    res.status(401).json({ success: false, message: '用户名或密码错误' });
  }
});

// 获取最近店铺接口
app.post('/api/nearest-shops', (req, res) => {
  console.log('收到参数', req.body);
  const { lat, lng } = req.body;
  if (lat == null || lng == null) return res.status(400).json({ error: '缺少参数' });
  const result = shops
    .map(shop => ({
      ...shop,
      distance: getDistance(lat, lng, shop.lat, shop.lng),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5);
  res.json(result);
});

app.listen(3001, () => {
  console.log('后端服务已启动，端口3001');
});