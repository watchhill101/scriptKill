import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/loginPage/login.jsx';
import Register from './pages/loginPage/register.jsx';
import Home from './pages/loginPage/home.jsx'; // 假设首页组件路径

function App() {
  return (
    <Router>
      <Routes>
        {/* 登录页面路由 */}
        <Route path="/login" element={<Login />} />
        {/* 注册页面路由 */}
        <Route path="/register" element={<Register />} />
        {/* 首页路由 */}
        <Route path="/home" element={<Home />} />
        {/* 默认重定向到登录页 */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;