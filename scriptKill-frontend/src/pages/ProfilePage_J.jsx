import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import TabBar from '../components/TabBar/TabBar';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, updateUserInfo } = useAuth();
  const [profileData, setProfileData] = useState({
    name: "",
    sex: 0,
    balance: 0,
    points: 0,
    coupons: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 初始化本地状态
    if (user) {
      setProfileData({
        name: user.name || "",
        sex: user.sex || 0,
        balance: user.balance || 0,
        points: user.points || 0,
        coupons: user.coupons?.length || 0
      });
    }
    
    // 从API获取用户资料
    const fetchProfile = async () => {
      setLoading(true);
      if (user && user._id) {
        try {
          const res = await axios.get(`http://localhost:3000/users/profile/${user._id}`);
          if (res.data.code === 200) {
            const data = res.data.data;
            setProfileData({
              name: data.name || "",
              sex: data.sex || 0,
              balance: data.balance || 0,
              points: data.points || 0,
              coupons: data.coupons?.length || 0
            });
            
            // 更新全局用户信息
            updateUserInfo(data);
          }
        } catch (error) {
          console.error("获取用户资料失败", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, updateUserInfo]);

  // 处理菜单项点击
  const handleMenuClick = (path) => {
    navigate(path);
  };

  // 处理退出登录
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="profile-container">
      {/* 用户信息头部 - 蓝色背景 */}
      <div className="profile-header">
        <img 
          src={user?.imgUrl || "https://robohash.org/default.png"} 
          alt="头像" 
          className="avatar"
        />
        <div className="user-info">
          <div className="username">{profileData.name || "未登录用户"}</div>
          <div className="gender-icon">{profileData.sex === 0 ? '♀' : '♂'}</div>
        </div>
        <div className="settings-icon" onClick={() => handleMenuClick("/settings")}>
          ⚙️
        </div>
      </div>

      {/* 资产信息 - 白色卡片 */}
      <div className="asset-container">
        <div className="asset-item">
          <div className="asset-value">{profileData.balance?.toFixed(2) || "0.00"}</div>
          <div className="asset-label">余额 (元)</div>
        </div>
        <div className="asset-item">
          <div className="asset-value">{profileData.points || "0"}</div>
          <div className="asset-label">积分</div>
        </div>
        <div className="asset-item">
          <div className="asset-value">{profileData.coupons || "0"}</div>
          <div className="asset-label">优惠券</div>
        </div>
      </div>

      {/* 菜单列表 */}
      <div className="menu-list">
        <div className="menu-item" onClick={() => handleMenuClick('/my-appointments')}>
          <span className="menu-icon">📅</span>
          <span className="menu-name">我的预约</span>
          <span className="menu-arrow">→</span>
        </div>
        
        <div className="menu-item" onClick={() => handleMenuClick('/coupon-list')}>
          <span className="menu-icon">🎫</span>
          <span className="menu-name">我的优惠券</span>
          <span className="menu-arrow">→</span>
        </div>
        
        <div className="menu-item" onClick={() => handleMenuClick('/fund-details')}>
          <span className="menu-icon">💰</span>
          <span className="menu-name">我的资金明细</span>
          <span className="menu-arrow">→</span>
        </div>
        
        <div className="menu-item" onClick={() => handleMenuClick('/want-play')}>
          <span className="menu-icon">🎮</span>
          <span className="menu-name">想玩的本</span>
          <span className="menu-arrow">→</span>
        </div>
        
        <div className="menu-item" onClick={() => handleMenuClick('/played')}>
          <span className="menu-icon">✅</span>
          <span className="menu-name">玩过的本</span>
          <span className="menu-arrow">→</span>
        </div>
        
        <div className="menu-item" onClick={() => handleMenuClick('/timeline')}>
          <span className="menu-icon">⏱️</span>
          <span className="menu-name">时间线工具</span>
          <span className="menu-arrow">→</span>
        </div>
        
        <div className="menu-item" onClick={() => handleMenuClick('/contact')}>
          <span className="menu-icon">📞</span>
          <span className="menu-name">联系我们</span>
          <span className="menu-arrow">→</span>
        </div>

        {/* 新增的菜单项 */}
        <div className="menu-item" onClick={() => handleMenuClick('/recharge-record')}>
          <span className="menu-icon">💰</span>
          <span className="menu-name">充值记录</span>
          <span className="menu-arrow">→</span>
        </div>

        <div className="menu-item" onClick={() => handleMenuClick('/points-detail')}>
          <span className="menu-icon">🏆</span>
          <span className="menu-name">积分明细</span>
          <span className="menu-arrow">→</span>
        </div>
      </div>

      {/* 底部导航栏 */}
      <TabBar />
    </div>
  );
};

export default ProfilePage;