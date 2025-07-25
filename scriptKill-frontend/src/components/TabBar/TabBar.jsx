import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppOutline, UserOutline } from 'antd-mobile-icons';
import './TabBar.css';

const TabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const tabs = [
    {
      key: 'home',
      title: '首页',
      icon: <AppOutline />,
      path: '/home'
    },
    {
      key: 'profile',
      title: '我的',
      icon: <UserOutline />,
      path: '/profile'
    }
  ];

  const handleTabClick = (path) => {
    navigate(path);
  };

  return (
    <div className="tab-bar">
      {tabs.map(tab => (
        <div 
          key={tab.key}
          className={`tab-item ${pathname === tab.path ? 'active' : ''}`}
          onClick={() => handleTabClick(tab.path)}
        >
          <div className="tab-icon">{tab.icon}</div>
          <div className="tab-title">{tab.title}</div>
        </div>
      ))}
    </div>
  );
};

export default TabBar;