import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Chong_J.css';
import { LeftOutlined } from '@ant-design/icons';


const RechargePage = () => {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [userBalance, setUserBalance] = useState(() => {
    try {
      // 从localStorage读取并转换为数字
      const savedBalance = localStorage.getItem('userBalance');
      if (savedBalance !== null && !isNaN(parseFloat(savedBalance))) {
        return parseFloat(savedBalance);
      }
    } catch (error) {
      console.error('读取本地存储余额失败:', error);
    }
    // 读取失败或无数据时使用默认值
    return 998.60;
  });
  const [userPoints, setUserPoints] = useState(680);

  // 充值金额选项配置
  const rechargeOptions = [
    { amount: 500, gift: 50 },
    { amount: 800, gift: 150 },
    { amount: 1000, gift: 300 },
    { amount: 2000, gift: 500 }
  ];

  // 处理充值提交
  const handleRecharge = () => {
    // 计算新余额（原余额 + 选中金额）
    const newBalance = userBalance + selectedAmount;
    // 更新状态
    setUserBalance(newBalance);
    // 保存到本地存储
    localStorage.setItem('userBalance', newBalance.toString());
    // 显示成功提示
    alert(`充值成功！您已成功充值 ${selectedAmount} 元，当前余额: ${newBalance.toFixed(2)} 元`);
    // 跳转到个人中心
    navigate('/profile');
  };

  return (
    <div className="recharge-container">
      <div className="recharge-header">
        <LeftOutlined className="back-button" onClick={() => navigate(-1)} />
        <h1>充值</h1>
      </div>

      <div className="user-balance">
        <div className="balance-item">
          <p>我的余额</p>
          <div className="amount">¥{userBalance.toFixed(2)}</div>
        </div>
        <div className="balance-item">
          <p>我的积分</p>
          <div className="amount">{userPoints}</div>
        </div>
      </div>

      <div className="recharge-amounts">
        <h2>选择充值金额</h2>
        <div className="amount-grid">
          {rechargeOptions.map(option => (
            <div 
              key={option.amount} 
              className={`amount-item ${selectedAmount === option.amount ? 'selected' : ''}`} 
              onClick={() => setSelectedAmount(option.amount)}
            >
              <p className="price">{option.amount}元</p>
              <p className="gift">赠送{option.gift}元</p>
            </div>
          ))}
        </div>
      </div>

      <div className="recharge-btn">
        <button onClick={handleRecharge}>立即充值</button>
      </div>
    </div>
  );
};

export default RechargePage;
