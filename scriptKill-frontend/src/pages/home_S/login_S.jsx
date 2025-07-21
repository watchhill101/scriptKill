import React, { useState } from 'react';
// import './LoginForm.css'; // 建议将样式单独写到css文件

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleShowHidePassword = (e) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 登录逻辑
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
            <h2>LOGIN to CodePen</h2>
            <form onSubmit={handleSubmit}>
              <div className="inputBx">
                <input
                  type="text"
                  required
                  value={login}
                  onChange={e => setLogin(e.target.value)}
                />
                <span>Login</span>
                <i className="fas fa-user-circle"></i>
              </div>
              <div className="inputBx password">
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <span>Password</span>
                <a
                  href="#"
                  className={`password-control${showPassword ? ' view' : ''}`}
                  onClick={handleShowHidePassword}
                >
                  {showPassword ? '隐藏' : '显示'}
                </a>
                <i className="fas fa-key"></i>
              </div>
              <label className="remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                />
                Remember
              </label>
              <div className="inputBx">
                <input type="submit" value="Log in" disabled={!login || !password} />
              </div>
            </form>
            <p>
              Forgot password? <a href="#">Click Here</a>
            </p>
            <p>
              Don't have an account <a href="#">Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}