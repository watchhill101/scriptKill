import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';

// 虚拟注册数据存储，模拟后端数据库
const mockRegisteredUsers = [];

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 简单的输入验证
    if (!username || !password) {
      setError('用户名和密码不能为空');
      return;
    }
    // 模拟检查用户是否已存在
    const userExists = mockRegisteredUsers.some(user => user.username === username);
    if (userExists) {
      setError('该用户名已被注册，请选择其他用户名');
      return;
    }
    // 模拟注册成功，将用户信息添加到虚拟存储中
    mockRegisteredUsers.push({ username, password });
    // 注册成功，跳转到登录页
    navigate('/login');
  };

  return (
    <section>
      <div className="box">
        <div className="square" style={{ '--i': 0 }}></div>
        <div className="square" style={{ '--i': 1 }}></div>
        <div className="square" style={{ '--i': 2 }}></div>
        <div className="square" style={{ '--i': 3 }}></div>
        <div className="square" style={{ '--i': 4 }}></div>
        <div className="square" style={{ '--i': 5 }}></div>
        <div className="container">
          <div className="form">
            <h2>注册</h2>
            {/* 错误提示 */}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="inputBx">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  // placeholder="请输入用户名"
                />
                <span style={{fontSize:'14px'}}>请输入用户名</span>
                <i className="fas fa-user-circle"></i>
              </div>
              <div className="inputBx password">
                <input
                  id="password-input"
                  type={isPasswordVisible ? 'text' : 'password'}
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  // placeholder="请输入密码"
                />
                <span style={{fontSize:'14px'}}>请输入密码</span>
                <a
                  href="#"
                  className={`password-control ${isPasswordVisible ? 'view' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    togglePasswordVisibility();
                  }}
                ></a>
                <i className="fas fa-key"></i>
              </div>
              <div className="inputBx">
                <Link to="/login">注册</Link>
              </div>
              <div className="inputBx">
                <Link to="/login">返回登录</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;