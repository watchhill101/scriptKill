import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home_S from './pages/home_S/home_S';
import Login_S from './pages/home_S/login_S';
import Register_S from './pages/home_S/registe_S';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/SZR" element={<Home_S />} />
        <Route path="/SZR/home" element={<Home_S />} />
        <Route path="/SZR/login" element={<Login_S />} />
        <Route path="/SZR/register" element={<Register_S />} />
        {/* 默认重定向到主页面 */}
        <Route path="*" element={<Navigate to="/SZR" />} />
      </Routes>
    </BrowserRouter>
  );
}