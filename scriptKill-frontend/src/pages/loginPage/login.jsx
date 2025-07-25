import React, { useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import debounce from "lodash/debounce";
import { useAuth } from "../../context/AuthContext";
import "./login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [register, setRegister] = useState(false);
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 检查用户是否已经存在
  const getUser = () => {
    const phone = inputRef.current.value;
    if (phone && phone.length === 11) {
      setLoading(true);
      setError('');
      
      axios
        .post("http://localhost:3000/users/login", { phone })
        .then((res) => {
          console.log('服务器响应:', res.data);
          if (res.data.code === 200) {
            // 存储完整用户信息（使用从后端获取的所有字段）
            const userData = {
              _id: res.data._id,
              openId: res.data.openId,
              name: res.data.name,
              imgUrl: res.data.imgUrl || "https://robohash.org/default.png",
              phone: res.data.phone,
              sex: res.data.sex,
              balance: res.data.balance || 0,
              points: res.data.points || 0
            };
            
            login(userData); // 使用AuthContext的login方法
            setRegister(true);
          } else {
            setRegister(false);
          }
        })
        .catch(err => {
          console.error('请求失败:', err);
          setError('连接服务器失败，请稍后再试');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  // 登录或注册
  const handLogin = () => {
    const phone = inputRef.current.value;
    if (!phone || phone.length !== 11) {
      setError('请输入正确的手机号码');
      return;
    }
    
    if (register) {
      navigate('/home');
    } else {
      navigate(`/register/${phone}`);
    }
  }

  // 使用防抖的获取用户函数
  const debouncedGetUser = useCallback(
    debounce(getUser, 1000), // 1000ms 延迟
    []
  );

  return (
    <div>
      <div className="card">
        <span className="card__title">剧本杀！</span>
        <p className="card__content">一起来玩剧本杀吧！</p>
        <div className="card__form">
          <input 
            ref={inputRef} 
            placeholder="手机号" 
            type="text" 
            onChange={debouncedGetUser} 
            disabled={loading}
          />
          {error && <div className="error-message">{error}</div>}
          <button 
            className="sign-up" 
            onClick={handLogin}
            disabled={loading}
          >
            {loading ? '正在处理...' : (register ? '登录' : '登录 / 注册')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
