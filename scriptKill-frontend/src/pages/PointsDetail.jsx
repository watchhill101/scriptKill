import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LeftOutline } from 'antd-mobile-icons';
import axios from 'axios';
import './PointsDetail.css';

const PointsDetail = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pointRecords, setPointRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPointRecords = async () => {
      if (user && user._id) {
        try {
          const res = await axios.get(`http://localhost:3000/users/pointRecords/${user._id}`);
          if (res.data.code === 200) {
            setPointRecords(res.data.data);
          }
        } catch (error) {
          console.error("获取积分记录失败", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPointRecords();
  }, [user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="points-container">
      <div className="points-header">
        <LeftOutline className="back-button" onClick={() => navigate(-1)} />
        <h1>积分明细</h1>
      </div>

      <div className="points-summary">
        <div className="points-total">
          <div className="total-label">当前积分</div>
          <div className="total-value">{user?.points || 0}</div>
        </div>
      </div>

      <div className="points-list">
        {loading ? (
          <div className="loading">加载中...</div>
        ) : pointRecords.length > 0 ? (
          pointRecords.map((record, index) => (
            <div className="point-item" key={index}>
              <div className="point-info">
                <div className="point-title">
                  {record.type === 'add' 
                    ? `获得积分: ${record.source || '充值奖励'}` 
                    : `使用积分: ${record.purpose || '积分消费'}`}
                </div>
                <div className="point-date">{formatDate(record.date)}</div>
              </div>
              <div className={`point-amount ${record.type === 'add' ? 'add' : 'use'}`}>
                {record.type === 'add' ? '+' : '-'}{record.points}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-record">
            <div className="empty-icon">📊</div>
            <div className="empty-text">暂无积分记录</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PointsDetail;