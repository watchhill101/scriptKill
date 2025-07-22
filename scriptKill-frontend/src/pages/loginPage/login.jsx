import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import axios from 'axios';

const Login = () => {
  const inputRef = useRef(null);
  const debounceTimer = useRef(null);
  const [register, setRegister] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  // 防抖函数
  const debounce = useCallback((func, delay) => {
    return (...args) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }, []);

  // 原始的获取用户函数
  const getUser = () => {
    if (inputRef.current.value.length === 11) {
      const phone = inputRef.current.value;
      axios.post('http://localhost:3000/users/login', { phone })
        .then(res => {
          console.log('服务器响应:', res.data);
          if (res.data.code === 200 && res.data.openId) {
            localStorage.setItem('_id', res.data._id);
            setRegister(true)
            // 这里可以跳转到主页面
          }
        })
        .catch(err => {
          console.error('请求失败:', err);
          if (err.code === 'ECONNREFUSED') {
            console.error('无法连接到服务器，请确保后端服务已启动');
          }
        });
    }
  };
  //登录或注册
  const handLogin = () => {
    if (register) {
      navigate('/home');
    } else {
      navigate(`/register/${inputRef.current.value}`);
    }
  }

  // 使用防抖的获取用户函数
  const debouncedGetUser = useCallback(
    debounce(getUser, 1000), // 500ms 延迟
    []
  );


  return (
    <div>
      <div className="card">
        <span className="card__title">剧本杀！</span>
        <p className="card__content">一起来玩剧本杀吧！</p>
        <div className="card__form">
          <input ref={inputRef} placeholder="手机号" type="text" onChange={debouncedGetUser} />
          <button className="sign-up" onClick={handLogin} > 登录/注册</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
