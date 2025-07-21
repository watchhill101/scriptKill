import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css';

export default function RegisterForm() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 表单验证
    if (!phone || !password || !confirmPassword) {
      alert('请填写完整信息');
      return;
    }
    
    if (password !== confirmPassword) {
      alert('两次密码不一致');
      return;
    }

    try {
      // 这里添加注册API调用
      console.log('注册信息:', { phone, password });
      // 注册成功后跳转到登录页
      navigate('/login');
    } catch (error) {
      console.error('注册失败:', error);
    }
  };

  return (
    <form className="form">
      <p>register</p>
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
        已有账号? <a href="/login">立即登录</a>
      </p>
    </form>
  );
}