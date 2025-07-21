import React from 'react';
import './you_X.css';

const CouponPage = () => {
  // 模拟优惠券数据
  const coupons = [
    {
      id: 1,
      amount: 50,
      name: '《云画和光》剧本优惠券',
      expiryDate: '2022.12.11到期',
      restriction: '仅限Yar沉浸式剧本杀1店',
      status: 'active', // active, used, expired
    },
    {
      id: 2,
      amount: 50,
      name: '《云画和光》剧本优惠券',
      expiryDate: '2022.12.11到期',
      restriction: '仅限Yar沉浸式剧本杀1店',
      status: 'used',
    },
    {
      id: 3,
      amount: 50,
      name: '《云画和光》剧本优惠券',
      expiryDate: '2022.12.11到期',
      restriction: '仅限Yar沉浸式剧本杀1店',
      status: 'expired',
    },
  ];

  const handleBack = () => {
    // 返回上一页逻辑
    console.log('返回上一页');
  };

  const handleUseCoupon = (couponId) => {
    // 使用优惠券逻辑
    console.log('使用优惠券:', couponId);
  };

  const renderCouponCard = (coupon) => {
    const isActive = coupon.status === 'active';
    const isUsed = coupon.status === 'used';
    const isExpired = coupon.status === 'expired';

    return (
      <div key={coupon.id} className={`coupon-card ${coupon.status}`}>
        {/* 状态标签 */}
        {isUsed && (
          <div className="status-ribbon used">
            <span>已使用</span>
          </div>
        )}
        {isExpired && (
          <div className="status-ribbon expired">
            <span>已过期</span>
          </div>
        )}

        {/* 优惠券内容 */}
        <div className="coupon-content">
          <div className="coupon-left">
            <div className="discount-amount">
              <span className="currency">¥</span>
              <span className="amount">{coupon.amount}</span>
            </div>
          </div>
          
          <div className="coupon-right">
            <div className="coupon-info">
              <div className="coupon-name">{coupon.name}</div>
              <div className="coupon-expiry">{coupon.expiryDate}</div>
              <div className="coupon-restriction">{coupon.restriction}</div>
            </div>
            
            {isActive && (
              <button 
                className="use-button"
                onClick={() => handleUseCoupon(coupon.id)}
              >
                立即使用
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="coupon-page">
      {/* 头部导航 */}
      <header className="page-header">
        <div className="header-left">
          <button className="back-button" onClick={handleBack}>
            ‹
          </button>
        </div>
        <div className="header-title">我的优惠券</div>
        <div className="header-right">
          <button className="menu-button">⋯</button>
          <button className="more-button">◎</button>
        </div>
      </header>

      {/* 优惠券列表 */}
      <div className="coupon-list">
        {coupons.map(renderCouponCard)}
      </div>
    </div>
  );
};

export default CouponPage;
