import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate
import './login.css'; // 建议将样式单独写到css文件


export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate(); // 初始化 navigate

  const handleShowHidePassword = (e) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 登录逻辑
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    navigate('/register'); // 跳转到注册页面
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
            <h2>剧本杀</h2>
            <form onSubmit={handleSubmit}>
              <div className="inputBx">
                <input
                  type="text"
                  required
                  value={login}
                  onChange={e => setLogin(e.target.value)}
                />
                <span>账号</span>
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
                <span>密码</span>
                <a
                  href="#"
                  className={`password-control${showPassword ? ' view' : ''}`}
                  onClick={handleShowHidePassword}
                >
                  {/* {showPassword ? '隐藏' : '显示'} */}
                </a>
                <i className="fas fa-key"></i>
              </div>
              <label className="remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                />
                记住密码
              </label>
              <div className="inputBx">
                <input type="submit" value="登录" disabled={!login || !password} />
              </div>
            </form>
            <p>
              忘记密码 <a href="#">点击这里</a>
            </p>
            <p>
              没有账号<a href="#" onClick={handleRegisterClick}> 注册</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}