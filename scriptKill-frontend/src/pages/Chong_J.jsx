import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Toast } from 'antd-mobile';
import { LeftOutline } from 'antd-mobile-icons';
import { rechargeBalance } from '../services/walletService';
import './Chong_J.css';
<<<<<<< Updated upstream
=======
import { LeftOutline } from 'antd-mobile-icons';

>>>>>>> Stashed changes

const RechargePage = () => {
  const navigate = useNavigate();
  const { user, updateUserInfo } = useAuth();
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [userBalance, setUserBalance] = useState(0);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // 充值金额选项配置
  const rechargeOptions = [
    { amount: 500, gift: 50 },
    { amount: 800, gift: 150 },
    { amount: 1000, gift: 300 },
    { amount: 2000, gift: 500 }
  ];

  // 获取用户余额和积分
  useEffect(() => {
    if (user && user._id) {
      setUserBalance(user.balance || 0);
      setUserPoints(user.points || 0);
    }
  }, [user]);

  // 处理充值提交
  const handleRecharge = async () => {
    if (!user || !user._id) {
      Toast.show({
        content: '请先登录',
        position: 'bottom',
      });
      return;
    }
    
    try {
      setLoading(true);
      const response = await rechargeBalance(user._id, selectedAmount);
      
      if (response.code === 200) {
        // 更新全局用户信息
        const updatedUserData = {
          ...user,
          balance: response.data.balance,
          points: response.data.points
        };
        
        updateUserInfo(updatedUserData);
        
        // 显示成功消息
        Toast.show({
          icon: 'success',
          content: `充值成功！赠送${response.data.bonusPoints}积分`,
          position: 'bottom',
        });
        
        // 更新localStorage
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        userInfo.balance = response.data.balance;
        userInfo.points = response.data.points;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        
        // 2秒后返回首页
        setTimeout(() => {
          navigate('/home');
        }, 2000);
      } else {
        Toast.show({
          icon: 'fail',
          content: response.msg || '充值失败，请重试',
          position: 'bottom',
        });
      }
    } catch (error) {
      console.error('充值失败', error);
      Toast.show({
        icon: 'fail',
        content: '充值失败，请重试',
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recharge-container">
      <div className="recharge-header">
        <LeftOutline className="back-button" onClick={() => navigate(-1)} />
        <h1>充值</h1>
      </div>

      <div className="user-balance">
        <div className="balance-item">
          <p>当前余额</p>
          <div className="amount">¥{userBalance.toFixed(2)}</div>
        </div>
        <div className="balance-item">
          <p>积分</p>
          <div className="amount">{userPoints}</div>
        </div>
      </div>

      <div className="recharge-amounts">
        <h2>选择充值金额</h2>
        <div className="amount-grid">
          {rechargeOptions.map((option) => (
            <div
              key={option.amount}
              className={`amount-item ${selectedAmount === option.amount ? 'selected' : ''}`}
              onClick={() => setSelectedAmount(option.amount)}
            >
              <div className="price">¥{option.amount}</div>
              <div className="gift">送{option.gift}积分</div>
            </div>
          ))}
        </div>
      </div>

      <div className="recharge-info">
        <p>充值说明:</p>
        <ul>
          <li>充值金额将实时到账</li>
          <li>充值金额的10%将作为积分奖励</li>
          <li>积分可用于兑换优惠券和参与特殊活动</li>
        </ul>
      </div>

      <div className="recharge-btn">
        <button onClick={handleRecharge} disabled={loading}>
          {loading ? '处理中...' : '立即充值'}
        </button>
      </div>
    </div>
  );
};

export default RechargePage;
