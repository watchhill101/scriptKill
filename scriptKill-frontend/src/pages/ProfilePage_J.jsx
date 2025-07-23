import React, { useState, useEffect } from 'react';
import './ProfilePage.css';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  // 添加余额状态管理
  const [balance, setBalance] = useState(0);
  
  // 从本地存储加载余额
  useEffect(() => {
    try {
      const savedBalance = localStorage.getItem('userBalance');
      if (savedBalance !== null) {
        // 解析存储的余额值（确保是数字类型）
        const parsedBalance = parseFloat(savedBalance);
        setBalance(isNaN(parsedBalance) ? 0 : parsedBalance);
      }
    } catch (error) {
      console.error('Failed to load balance from localStorage:', error);
    }
  }, []);

  // 模拟用户数据（移除硬编码的balance属性）
  const userData = {
    name: '晨曦Vic',
    avatar: 'https://i.pravatar.cc/100?img=12',
    points: 680,
    coupons: 0,
    menuItems: [
      { icon: '📅', text: '我的预约', path: '/reservations' },
      { icon: '🎫', text: '我的优惠券', path: '/coupon-list' },
      { icon: '💰', text: '我的资金明细', path: '/recharge' },
      { icon: '🎮', text: '想玩的本', path: '/wishlist' },
      { icon: '✅', text: '玩过的本', path: '/played' },
      { icon: '⏱️', text: '时间线工具', path: '/timeline' },
      { icon: '📞', text: '联系我们', path: '/contact' }
    ]
  };

  const navigate = useNavigate();

  return (
    <div className="profile-container">
      {/* 用户信息头部 */}
      <div className="profile-header">
        <div className="user-info">
          <img src={userData.avatar} alt={userData.name} className="avatar" />
          <div className="name-section">
            <h2 className="username">{userData.name}</h2>
            <span className="gender">♀</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="more-btn">⋮</button>
          <button className="settings-btn">⚙️</button>
        </div>
      </div>

      {/* 余额积分区域 - 使用状态中的balance */}
      <div className="stats-container">
        <div className="stat-item" onClick={() => navigate('/chong')} style={{ cursor: 'pointer' }}>
          <div className="stat-value">{balance.toFixed(2)}</div>
          <div className="stat-label">余额（元）</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{userData.points}</div>
          <div className="stat-label">积分</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{userData.coupons}</div>
          <div className="stat-label">优惠券</div>
        </div>
      </div>

      {/* 功能菜单列表 */}
      <div className="menu-list">
        {userData.menuItems.map((item, index) => (
          <div 
            key={index} 
            className="menu-item" 
            onClick={() => navigate(item.path)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-text">{item.text}</span>
            <span className="menu-arrow">→</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;