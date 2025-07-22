import React, { useState,useEffect } from 'react';
import './CouponList.css';
import axios from 'axios';

// const coupons = [
//   {
//     id: 1,
//     amount: 50,
//     title: '《云画和光》剧本优惠券',
//     expire: '2022.12.11到期',
//     shop: '仅限Yar沉浸式剧本杀1店',
//     status: 'available',
//   },
//   {
//     id: 2,
//     amount: 50,
//     title: '《云画和光》剧本优惠券',
//     expire: '2022.12.11到期',
//     shop: '仅限Yar沉浸式剧本杀1店',
//     status: 'used',
//   },
//   {
//     id: 3,
//     amount: 50,
//     title: '《云画和光》剧本优惠券',
//     expire: '2022.12.11到期',
//     shop: '仅限Yar沉浸式剧本杀1店',
//     status: 'expired',
//   },
// ];

// const statusText = {
//   available: '',
//   used: '已使用',
//   expired: '已过期',
// };

function CouponList() {
  const [coupons, setCoupons] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:3000/coupon')
      .then(res => {
        setCoupons([...res.data.data]);
      });
  }, []);

  console.log(coupons);

  return (
    <div className="coupon-list-container">
      <div className="coupon-list-header">
        <span className="header-back">&#60;</span>
        <span className="coupon-list-title">我的优惠券</span>
        <span className="header-more">···</span>
        <span className="header-o">◎</span>
      </div>
      <div className="coupon-list-content">
        {coupons.map((coupon) => (
          <div
            className={`coupon-card coupon-${coupon.status === 0 ? 'available' : coupon.status === 1 ? 'used' : 'expired'}`}
            key={coupon.id}
          >
            {/* 状态标记放在卡片最前面，左上角 */}
            {coupon.status === 1 && (
              <div className="coupon-status coupon-status-used">已使用</div>
            )}
            {coupon.status === 2 && (
              <div className="coupon-status coupon-status-expired">已过期</div>
            )}
            {/* 其余内容不变 */}
            <div className="coupon-info">
              <div className="coupon-amount">
                <span className="coupon-currency">￥</span>
                <span className="coupon-value">{coupon.amount}</span>
              </div>
              <div className="coupon-details">
                <div className="coupon-title">{coupon.title}</div>
                <div className="coupon-expire">{coupon.expire}</div>
                <div className="coupon-shop">{coupon.shop}</div>
              </div>
              {coupon.status === 0 && (
                <button className="coupon-use-btn">立即使用</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CouponList; 