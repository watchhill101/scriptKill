import { useParams } from "react-router-dom";
import Switch from '../../components/Toggle-switches'
import './login.css';

const Register = () => {
  const params = useParams();
  console.log(params);

  const handleGenderChange = (gender) => {
    console.log('性别选择:', gender === 1 ? '男' : '女', '值:', gender);
  };

  return (
    <div>
      <div className="card">
        <span className="card__title">剧本杀！</span>
        <p className="card__content">欢迎加入我们！</p>
        <div className="card__form">
          <input placeholder="用户名" type="text" />
          <Switch onChange={handleGenderChange} defaultValue={1} />
          <button className="sign-up" > 完成 </button>
        </div>
      </div>
    </div>
  )
}
export default Register;