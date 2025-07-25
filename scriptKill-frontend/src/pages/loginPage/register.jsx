import React, { useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./register.css";
import axios from "axios";
import { Switch } from "antd-mobile";
import { useAuth } from "../../context/AuthContext"; // 导入AuthContext

const Register = () => {
  const { phone } = useParams();
  const navigate = useNavigate();
  const inputRef = useRef();
  const [gender, setGender] = useState(1); // 1-男, 0-女
  const { login } = useAuth(); // 获取login方法

  const handleGenderChange = (checked) => {
    setGender(checked ? 1 : 0);
  };

  const submit = () => {
    if (!inputRef.current.value) {
      alert("用户名不能为空");
      return;
    }

    const userInfo = {
      phone,
      name: inputRef.current.value,
      sex: gender,
    };

    axios.post("http://localhost:3000/users/register", userInfo).then((res) => {
      if (res.data.code === 200) {
        // 保存完整的用户信息
        const userData = {
          _id: res.data._id,
          name: userInfo.name,
          phone: userInfo.phone,
          sex: userInfo.sex,
          imgUrl: res.data.imgUrl || "https://robohash.org/default.png",
          balance: 0,
          points: 0
        };
        
        // 使用AuthContext的login方法
        login(userData);
        
        navigate("/home");
      }
    });
  };

  return (
    <div>
      <div className="card">
        <span className="card__title">剧本杀！</span>
        <p className="card__content">欢迎加入我们！</p>
        <div className="card__form">
          <input ref={inputRef} placeholder="用户名" type="text" />
          <div className="gender-selection">
            <span>性别：{gender ? "男" : "女"}</span>
            <Switch
              onChange={handleGenderChange}
              defaultChecked={gender === 1}
            />
          </div>
          <button className="sign-up" onClick={submit}>
            完成
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
