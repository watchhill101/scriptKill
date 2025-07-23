import { useParams } from "react-router-dom";
import Switch from "../../components/Toggle-switches";
import "./login.css";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const params = useParams();
  const phone = params.phone;
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [sexn, setSexn] = useState(1);

  const handleGenderChange = (gender) => {
    console.log("性别选择:", gender === 1 ? "男" : "女", "值:", gender);
    setSexn(gender);
  };
  const submit = () => {
    if (inputRef.current.value === "") {
      alert("请输入用户名");
      return;
    }
    const params = {
      name: inputRef.current.value,
      phone: phone,
      sex: sexn,
    };
    console.log(params);

    axios.post("http://localhost:3000/users/register", params).then((res) => {
      console.log(res);
      if (res.data.code === 200) {
        localStorage.setItem("_id", JSON.stringify(res.data._id));
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
          <Switch onChange={handleGenderChange} defaultValue={1} />
          <button className="sign-up" onClick={submit}>
            {" "}
            完成{" "}
          </button>
        </div>
      </div>
    </div>
  );
};
export default Register;
