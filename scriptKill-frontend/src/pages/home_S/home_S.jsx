import React, { useState } from 'react';
import { Button, List, SpinLoading, Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import './home_S.css';

export default function Home_S() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 获取最近店铺（不再判断登录）
  const fetchNearestShops = () => {
    if (!navigator.geolocation) {
      Toast.show({ content: '不支持定位', duration: 1000 });
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        fetch('http://localhost:3001/api/nearest-shops', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat: latitude, lng: longitude }),
        })
          .then(res => res.json())
          .then(data => {
            setShops(data);
            setLoading(false);
          })
          .catch(() => {
            Toast.show({ content: '获取店铺失败', duration: 1000 });
            setLoading(false);
          });
      },
      () => {
        Toast.show({ content: '定位失败', duration: 1000 });
        setLoading(false);
      }
    );
  };

  // 判断是否登录，仅用于显示登录/退出按钮
  const isLogin = localStorage.getItem('isLogin') === '1';
  const handleLogout = () => {
    localStorage.removeItem('isLogin');
    Toast.show({ content: '已退出登录', duration: 1000 });
    setTimeout(() => navigate('/SZR/login'), 1000);
  };

  return (
    <div className="home-container">
      <h2 className="home-title">剧本杀小程序首页</h2>
      <Button
        color="primary"
        onClick={fetchNearestShops}
        className="get-shop-btn"
      >
        获取距离最近的店铺
      </Button>
      {loading && <SpinLoading style={{ margin: 16 }} />}
      <List header="最近的店铺" className="shop-list">
        {shops.map(shop => (
          <List.Item key={shop.id}>
            {shop.name} - 距离：{shop.distance.toFixed(2)} km
          </List.Item>
        ))}
      </List>
      {!isLogin ? (
        <Button
          onClick={() => navigate('/SZR/login')}
          className="login-btn"
        >
          登录/注册
        </Button>
      ) : (
        <Button
          onClick={handleLogout}
          className="login-btn"
          color="danger"
        >
          退出登录
        </Button>
      )}
    </div>
  );
}