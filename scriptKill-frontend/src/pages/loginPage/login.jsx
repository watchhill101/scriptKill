import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';

// 定义虚拟数据
const mockData = {
  phone: '12345678901',
  password: '123456'
};

const Login = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loginValue, setLoginValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    // 验证输入与虚拟数据是否匹配
    if (loginValue === mockData.phone && passwordValue === mockData.password) {
      // 验证成功，跳转到 home 页面
      navigate('/home');
    } else {
      // 验证失败，显示错误信息
      setError('手机号或密码错误');
    }
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
            <h2>小程序登录</h2>
            <form onSubmit={handleLogin}>
              <div className="inputBx">
                <input
                  type="text"
                  required
                  value={loginValue}
                  onChange={(e) => setLoginValue(e.target.value)}
                />
                <span style={{fontSize:'18px'}}>手机号</span>
                <i className="fas fa-user-circle"></i>
              </div>
              <div className="inputBx password">
                <input
                  id="password-input"
                  type={isPasswordVisible ? 'text' : 'password'}
                  name="password"
                  required
                  value={passwordValue}
                  onChange={(e) => setPasswordValue(e.target.value)}
                />
                <span style={{fontSize:'18px'}}>密码</span>
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
              <label className="remember">
                <input type="checkbox" />
                <span style={{fontSize:'18px'}}>记住密码</span>
              </label>
              {/* 显示错误信息 */}
              {error && <p style={{ color: 'red', fontSize: '18px' }}>{error}</p>}
              <div className="inputBx">
                <button type="submit" style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer',fontSize:'32px' }}>登录</button>
              </div>
            </form>
            <p>
              忘记密码 <Link to="/forgot-password">点击这里</Link>
            </p>
            <p>
              没有账号 <Link to="/register">点击注册</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;