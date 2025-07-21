import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./FundDetailRecharge.css";

const rechargeList = [
  { id: 1, type: "充值", time: "2022.12.05 15:00:25", amount: 500 },
  { id: 2, type: "充值", time: "2022.12.05 15:00:25", amount: 500 },
  { id: 3, type: "充值", time: "2022.12.05 15:00:25", amount: 100 },
];

export default function FundDetailRecharge() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("recharge");
  return (
    <div className="fund-page">
      <header className="fund-header">
        <span className="back">&#60;</span>
        <span className="title">资金明细</span>
        <div className="header-right">
          <span className="dot">●●●</span>
          <span className="circle">◎</span>
        </div>
      </header>
      <div className="fund-tabs">
        <span className={tab === "recharge" ? "tab active" : "tab"} onClick={() => setTab("recharge")}>充值记录</span>
        <span className={tab === "debit" ? "tab active" : "tab"} onClick={() => setTab("debit")}>扣款记录</span>
      </div>
      <div className="fund-list">
        {rechargeList.map((item) => (
          <div className="fund-card" key={item.id}>
            <div className="fund-type">{item.type}</div>
            <div className="fund-time">{item.time}</div>
            <div className="fund-amount plus">+{item.amount}.00</div>
          </div>
        ))}
      </div>
      <button className="jump-btn" onClick={() => navigate('/debit')}>
        去扣款记录
      </button>
    </div>
  );
} 