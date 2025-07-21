import React, { useState } from 'react';
import { Button, Input, Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import './login_S.css';

export default function Register_S() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !password || !confirm) {
      Toast.show({ content: '请填写完整信息', duration: 1000 });
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
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        Toast.show({ content: '注册成功', duration: 1000 });
        setTimeout(() => navigate('/SZR/login'), 1000);
      } else {
        Toast.show({ content: data.message || '注册失败', duration: 1000 });
      }
    } catch {
      Toast.show({ content: '网络错误', duration: 1000 });
    }
  };

  return (
    <div className="login-mobile-bg">
      <div className="login-mobile-container">
        <div className="login-mobile-header">
          <img
            src="../public/OIP-C.webp"
            alt="插画"
            className="login-mobile-illustration"
          />
          <div className="login-mobile-welcome">欢迎注册</div>
          <div className="login-mobile-desc">剧本杀小程序</div>
        </div>
        <Input
          className="login-input"
          placeholder="请输入用户名"
          value={username}
          onChange={val => setUsername(val)}
          clearable
        />
        <Input
          className="login-input"
          placeholder="请输入密码"
          type="password"
          value={password}
          onChange={val => setPassword(val)}
          clearable
        />
        <Input
          className="login-input"
          placeholder="请再次输入密码"
          type="password"
          value={confirm}
          onChange={val => setConfirm(val)}
          clearable
        />
        <Button
          block
          color="primary"
          className="login-btn"
          onClick={handleRegister}
        >
          注册
        </Button>
        <Button
          block
          className="login-btn"
          onClick={() => navigate('/SZR/login')}
        >
          返回登录
        </Button>
      </div>
    </div>
  );
}