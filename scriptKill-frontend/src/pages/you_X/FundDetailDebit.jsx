import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FundDetailDebit.css';

function FundDetailDebit() {
  const navigate = useNavigate();
  return (
    <div className="fund-detail-debit-container">
      <button className="jump-btn" onClick={() => navigate('/recharge')}>
        去充值记录
      </button>
      {/* 这里是原有内容 */}
    </div>
  );
}

export default FundDetailDebit; 