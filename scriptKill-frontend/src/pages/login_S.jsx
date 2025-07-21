import React, { useState } from 'react';
import { Button, Input, Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import './login_S.css';

export default function Login_S() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (username && password) {
      try {
        const res = await fetch('http://localhost:3001/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (data.success) {
          // 登录成功，保存登录状态
          localStorage.setItem('isLogin', '1');
          Toast.show({ content: '登录成功', duration: 1000 });
          setTimeout(() => navigate('/SZR/home'), 1000);
        } else {
          Toast.show({ content: data.message || '登录失败', duration: 1000 });
        }
      } catch {
        Toast.show({ content: '网络错误', duration: 1000 });
      }
    } else {
      Toast.show({ content: '请输入用户名和密码', duration: 1000 });
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
          <div className="login-mobile-welcome">欢迎登录</div>
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
        <Button
          block
          color="primary"
          className="login-btn"
          onClick={handleLogin}
        >
          登录
        </Button>
        <Button
          block
          className="login-btn"
          onClick={() => navigate('/SZR/register')}
          style={{ marginTop: 8 }}
        >
          注册
        </Button>
      </div>
    </div>
  );
}