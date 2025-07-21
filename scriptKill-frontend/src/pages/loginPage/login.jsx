import { useState } from 'react';
import './login.css';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // 处理登录逻辑
    console.log('提交:', { email, password });
  };

  return (
    <form className="form">
      <p>Login</p>
      <div className="group">
        <input required className="main-input" type="text" />
          <span className="highlight-span"></span>
          <label className="lebal-email">Phone</label>
      </div>
      <div className="container-1">
        <div className="group">
          <input required className="main-input" type="text" />
            <span className="highlight-span"></span>
            <label className="lebal-email">Verification code</label>
        </div>
      </div>
      <button className="submit" onClick={handleSubmit}>submit</button>
      {/* 添加注册跳转链接 */}
      <p>
        没有账号? <a href="/register">立即注册</a>
      </p>
    </form>
  );
}