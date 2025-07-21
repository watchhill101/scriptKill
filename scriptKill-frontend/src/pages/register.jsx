import React, { useState } from 'react';
import { Button, Input, Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import './register.css';

export default function Register() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigate = useNavigate();

  // 手机号正则（简单校验）
  const phoneReg = /^1[3-9]\d{9}$/;

  const handleRegister = async () => {
    if (!phone || !password || !confirm) {
      Toast.show({ content: '请填写完整信息', duration: 1000 });
      return;
    }
    if (!phoneReg.test(phone)) {
      Toast.show({ content: '请输入有效的手机号', duration: 1000 });
      return;
    }
    if (password !== confirm) {
      Toast.show({ content: '两次密码不一致', duration: 1000 });
      return;
    }
    try {
      const res = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: phone, password }),
      });
      const data = await res.json();
      if (data.success) {
        Toast.show({ content: '注册成功', duration: 1000 });
        setTimeout(() => navigate('/login'), 1000);
      } else {
        Toast.show({ content: data.message || '注册失败', duration: 1000 });
      }
    } catch {
      Toast.show({ content: '网络错误', duration: 1000 });
    }
  };

  return (
    <div className="register-bg">
  <div className="register-container">
    <div className="register-header">
      <img
        src="https://img.js.design/assets/img/64e5e2e1b7b5b0b6e8e7f3e2.png"
        alt="插画"
        className="register-illustration"
      />
      <div className="register-title">手机号注册</div>
      <div className="register-desc">剧本杀小程序</div>
    </div>
    <Input
      className="register-input"
      placeholder="请输入手机号"
      value={phone}
      onChange={val => setPhone(val)}
      clearable
    />
    <Input
      className="register-input"
      placeholder="请输入密码"
      type="password"
      value={password}
      onChange={val => setPassword(val)}
      clearable
    />
    <Input
      className="register-input"
      placeholder="请再次输入密码"
      type="password"
      value={confirm}
      onChange={val => setConfirm(val)}
      clearable
    />
    <Button
      block
      color="primary"
      className="register-btn"
      onClick={handleRegister}
    >
      注册
    </Button>
    <Button
      block
      className="register-btn"
      onClick={() => navigate('/login')}
      style={{ background: '#fff', color: '#a18cd1', border: '1.5px solid #a18cd1' }}
    >
      返回登录
    </Button>
  </div>
</div>
  );
}