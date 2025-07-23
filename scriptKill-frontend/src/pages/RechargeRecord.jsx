import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LeftOutline } from 'antd-mobile-icons';
import axios from 'axios';
import './RechargeRecord.css';

const RechargeRecord = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (user && user._id) {
        try {
          const res = await axios.get(`http://localhost:3000/users/transactions/${user._id}`);
          if (res.data.code === 200) {
            // 只过滤出充值记录
            const recharges = res.data.data.filter(trans => trans.type === 'recharge');
            setTransactions(recharges);
          }
        } catch (error) {
          console.error("获取交易记录失败", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTransactions();
  }, [user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="record-container">
      <div className="record-header">
        <LeftOutline className="back-button" onClick={() => navigate(-1)} />
        <h1>充值记录</h1>
      </div>

      <div className="record-list">
        {loading ? (
          <div className="loading">加载中...</div>
        ) : transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <div className="record-item" key={index}>
              <div className="record-info">
                <div className="record-title">充值</div>
                <div className="record-date">{formatDate(transaction.date)}</div>
              </div>
              <div className="record-amount">
                <div className="amount-value">+¥{transaction.amount.toFixed(2)}</div>
                <div className="points-value">+{transaction.bonusPoints} 积分</div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-record">
            <div className="empty-icon">📝</div>
            <div className="empty-text">暂无充值记录</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RechargeRecord;