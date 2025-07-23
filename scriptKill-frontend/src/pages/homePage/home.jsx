import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import "./home.css";
import TabBar from '../../components/TabBar/TabBar';

const Home = () => {
  const navigate = useNavigate();
  const { user, updateUserInfo } = useAuth();
  const [userInfo, setUserInfo] = useState({
    name: "Rinta",
    avatar: "/堂主.png",
    vipLevel: 1,
    balance: 0.0,
    points: 100,
  });
  
  // 轮播图相关状态
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselImages = [
    {
      url: "/lunbo3.jpg",
      title: "精彩剧本，等你体验",
    },
    {
      url: "/lunbo2.png",
      title: "推理解谜，烧脑挑战",
    },
    {
      url: "/lunbo1.png",
      title: "好友同行，欢乐加倍",
    },
  ];

  // 自动轮播功能
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    
    return () => clearInterval(timer);
  }, [carouselImages.length]);
  
  // 切换轮播图
  const handleSlideChange = (index) => {
    setActiveSlide(index);
  };
  
  // 获取用户信息
  useEffect(() => {
    if (user && user._id) {
      // 初始化本地状态
      setUserInfo({
        name: user.name || "未命名用户",
        avatar: user.imgUrl || "https://robohash.org/default.png",
        vipLevel: user.vipLevel || 0,
        balance: user.balance || 0,
        points: user.points || 0,
      });
      
      // 从API获取最新用户信息
      const fetchUserInfo = async () => {
        try {
          const res = await axios.get(`http://localhost:3000/users/profile/${user._id}`);
          if (res.data.code === 200) {
            const data = res.data.data;
            // 更新本地状态
            setUserInfo({
              name: data.name || "未命名用户",
              avatar: data.imgUrl || "https://robohash.org/default.png",
              vipLevel: data.vipLevel || 0,
              balance: data.balance || 0,
              points: data.points || 0,
            });
            
            // 更新全局用户信息
            updateUserInfo(data);
          }
        } catch (error) {
          console.error("获取用户信息失败", error);
        }
      };
      
      fetchUserInfo();
    }
  }, [user, updateUserInfo]);

  // 点击功能按钮处理
  const handleFunctionClick = (path) => {
    navigate(path);
  };

  return (
    <div className="home-container">
      {/* 轮播图区域 - 增强版 */}
      <div className="carousel-section">
        {carouselImages.map((image, index) => (
          <div 
            key={index} 
            className={`carousel-slide ${index === activeSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${image.url})` }}
          >
            <div className="carousel-overlay"></div>
            <div className="carousel-content">
              {image.title}
            </div>
          </div>
        ))}
        
        <div className="carousel-indicators">
          {carouselImages.map((_, index) => (
            <div 
              key={index} 
              className={`indicator ${index === activeSlide ? 'active' : ''}`}
              onClick={() => handleSlideChange(index)}
            ></div>
          ))}
        </div>
      </div>

      {/* 用户信息区域 */}
      <div className="user-card">
        <div className="user-profile">
          <img src={userInfo.avatar} alt="用户头像" className="user-avatar" />
          <div className="user-name-container">
            <div className="user-name">{userInfo.name}</div>
            {userInfo.vipLevel > 0 && <div className="vip-tag">VIP {userInfo.vipLevel}</div>}
          </div>
        </div>
        <div className="user-stats">
          <div className="stat-column">
            <div className="stat-value">{userInfo.balance.toFixed(2)}</div>
            <div className="stat-label">余额 (元)</div>
          </div>
          <div className="stat-column">
            <div className="stat-value">{userInfo.points}</div>
            <div className="stat-label">积分</div>
          </div>
          <div className="stat-column">
            <div className="stat-value">0</div>
            <div className="stat-label">优惠券</div>
          </div>
        </div>
      </div>

      {/* 充值活动盒子 */}
      <div 
        className="recharge-banner"
        onClick={() => handleFunctionClick('/chong')}
      >
        <div className="banner-content">
          <div className="banner-text">
            <span className="banner-title">充值活动 限时优惠</span>
            <span className="banner-subtitle">立即参与</span>
          </div>
          <div className="banner-button">GO</div>
        </div>
      </div>

      {/* 功能按钮区域 */}
      <div className="function-buttons">
        <div className="function-button script-button" onClick={() => handleFunctionClick('/script')}>
          <div className="button-title">剧本列表</div>
          <div className="button-subtitle">开启一段美好旅程</div>
        </div>
        
        <div className="function-buttons-row">
          <div 
            className="function-button carpool-button"
            onClick={() => handleFunctionClick('/start-car')}
          >
            <div className="button-title">发车啦</div>
            <div className="button-subtitle">快来加入路人车队</div>
          </div>
          
          <div 
            className="function-button ranking-button"
            onClick={() => handleFunctionClick('/ranking')}
          >
            <div className="button-title">排行榜</div>
            <div className="button-subtitle">来看你的排名吧</div>
          </div>
        </div>
      </div>

      {/* 底部导航栏 */}
      <TabBar />
    </div>
  );
};

export default Home;
