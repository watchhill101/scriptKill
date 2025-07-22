import React from 'react';
import './FundDetailDebit.css';
import { useNavigate } from 'react-router-dom';

const debitList = [
  { id: 1, type: '扣款', time: '2022.12.05 15:00:25', amount: -500 },
  { id: 2, type: '扣款', time: '2022.12.05 15:00:25', amount: 500 },
  { id: 3, type: '扣款', time: '2022.12.05 15:00:25', amount: 100 },
];

export default function FundDetailDebit() {
  const navigate = useNavigate();

  const handleCardClick = (item) => {
    // 跳转到详情页面，并传递相关参数
    navigate(`/fund-detail/${item.id}`, { state: { ...item } });
  };

  return (
    <div className="fund-detail-container">
      <div className="fund-detail-header">
        <span className="header-back">&#60;</span>
        <span className="fund-detail-title">资金明细</span>
        <div className="header-right">
          <span className="header-more">···</span>
          <span className="header-o">&#9416;</span>
        </div>
      </div>
      <div className="fund-detail-tabs">
        <span className="tab" onClick={() => navigate('/recharge')}>充值记录</span>
        <span className="tab active">扣款记录</span>
      </div>
      <div className="fund-detail-list">
        {debitList.map(item => (
          <div 
            className="fund-detail-card" 
            key={item.id}
            onClick={() => handleCardClick(item)}
            style={{ cursor: 'pointer' }}
          >
            <div className="fund-detail-type">{item.type}</div>
            <div className="fund-detail-time">{item.time}</div>
            <div className={"fund-detail-amount " + (item.amount < 0 ? 'minus' : 'plus')}>
              {item.amount < 0 ? item.amount : '+' + item.amount}.00
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}