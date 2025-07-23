import React, { useState, useEffect } from "react";
import "./home.css";

const Home = () => {
  const [userInfo] = useState({
    name: "Rinta",
    avatar: "https://via.placeholder.com/60x60/cccccc/ffffff?text=R",
    vipLevel: 1,
    balance: 0.0,
    points: 100,
  });

  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = [
    {
      id: 1,
      title: "AK剧本杀俱乐部",
      background: "linear-gradient(135deg, #8B4513 0%, #A0522D 100%)",
      image:
        "https://via.placeholder.com/400x200/8B4513/ffffff?text=AK剧本杀俱乐部",
    },
    {
      id: 2,
      title: "精彩剧本等你来",
      background: "linear-gradient(135deg, #2C3E50 0%, #34495E 100%)",
      image:
        "https://via.placeholder.com/400x200/2C3E50/ffffff?text=精彩剧本等你来",
    },
    {
      id: 3,
      title: "沉浸式体验",
      background: "linear-gradient(135deg, #8E44AD 0%, #9B59B6 100%)",
      image:
        "https://via.placeholder.com/400x200/8E44AD/ffffff?text=沉浸式体验",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [carouselImages.length]);

  return (
    <div className="home-container">
      {/* 顶部轮播图区域 */}
      <div className="carousel-section">
        <div className="carousel-container">
          {carouselImages.map((slide, index) => (
            <div
              key={slide.id}
              className={`carousel-slide ${
                index === currentSlide ? "active" : ""
              }`}
              style={{ background: slide.background }}
            >
              <div className="carousel-content">
                <div className="store-logo">{slide.title}</div>
                <div className="carousel-decorations">
                  <div className="decoration-circle red"></div>
                  <div className="decoration-circle dark"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 轮播图指示器 */}
        <div className="carousel-indicators">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* 用户信息区域 */}
      <div className="user-info-section">
        <div className="user-avatar">
          <img src={userInfo.avatar} alt="用户头像" />
        </div>
        <div className="user-details">
          <div className="user-name-row">
            <span className="user-name">{userInfo.name}</span>
            <span className="vip-badge">VIP {userInfo.vipLevel}</span>
          </div>
          <div className="user-balance">
            余额: {userInfo.balance.toFixed(2)}
          </div>
        </div>
        <div className="user-points">积分: {userInfo.points}</div>
      </div>

      {/* 充值活动横幅 */}
      <div className="recharge-banner">
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
        <div className="button-row">
          <div className="function-button large-button orange-button">
            <div className="button-title">剧本列表</div>
            <div className="button-subtitle">开启一段美好旅程</div>
          </div>
          <div className="button-column">
            <div className="function-button small-button green-button">
              <div className="button-title">发车站</div>
              <div className="button-subtitle">快来加入路人车队</div>
            </div>
            <div className="function-button small-button blue-button">
              <div className="button-title">排行榜</div>
              <div className="button-subtitle">来看你的排名吧</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
