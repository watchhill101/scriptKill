import React from 'react';
import './FundDetailRecharge.css';

const rechargeList = [
  { id: 1, type: '充值', time: '2022.12.05 15:00:25', amount: 500 },
  { id: 2, type: '充值', time: '2022.12.05 15:00:25', amount: 500 },
  { id: 3, type: '充值', time: '2022.12.05 15:00:25', amount: 100 },
];

export default function FundDetailRecharge() {
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
        <span className="tab active">充值记录</span>
        <span className="tab">扣款记录</span>
      </div>
      <div className="fund-detail-list">
        {rechargeList.map(item => (
          <div className="fund-detail-card" key={item.id}>
            <div className="fund-detail-type">{item.type}</div>
            <div className="fund-detail-time">{item.time}</div>
            <div className="fund-detail-amount plus">
              +{item.amount}.00
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 