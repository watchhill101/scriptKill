import React, { useState, useEffect } from 'react';
import {
  NavBar,
  Card,
  Stepper,
  Button,
  TextArea,
  Image,
  Tag,
  Divider,
  Toast
} from 'antd-mobile';
import {
  LeftOutline,
  EnvironmentOutline,
  ClockCircleOutline,
  UserOutline,
  PayCircleOutline,
  DownOutline,
  CheckShieldOutline
} from 'antd-mobile-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import TimeSelection from '../../components/TimeSelection_Z/TimeSelection_Z';
import { appointmentAPI, couponAPI, scriptAPI } from '../../services/api_Z';
import './Appointment_payment_Z.scss';

// 假数据 - 剧本信息
const mockScript = {
  id: 'script_001',
  name: '青楼',
  image: 'https://via.placeholder.com/120x160',
  price: 168,
  originPrice: 198,
  duration: 240, // 分钟
  minPeople: 5,
  maxPeople: 10,
  shop: {
    id: 'shop_001',
    name: '戏精学院',
    address: '北京市朝阳区建国路88号SOHO现代城',
    distance: '1.2km'
  },
  description: '古风/欢乐/机制/本格/7人/4男3女/4小时',
  tags: ['欢乐', '阵营', '机制', '古风']
};

// 假数据 - 优惠券
const mockCoupons = [
  { id: 'coupon_001', name: '新用户专享', amount: 30, condition: '满100元可用', expiredAt: '2023-12-31' },
  { id: 'coupon_002', name: '周末特惠', amount: 50, condition: '满200元可用', expiredAt: '2023-12-31' },
];

const AppointmentPaymentZ = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 修改状态管理
  const [scriptData, setScriptData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    people: 0, // 初始值将在获取剧本数据后设置
    remark: '',
    selectedDate: new Date(),
    selectedTime: null,
    coupon: null,
    showCouponList: false
  });
  const [showTimePopup, setShowTimePopup] = useState(false);
  const [coupons, setCoupons] = useState([]);

  // 获取剧本和门店信息
  useEffect(() => {
    const scriptId = location.state?.scriptId || '687e0e1cd0b7b89f7803a679'; // 实际的剧本ID
    
    const fetchScriptData = async () => {
      try {
        setLoading(true);
        const res = await scriptAPI.getDetail(scriptId);
        
        if (res.data.code === 0) {
          setScriptData(res.data.data);
          // 设置初始人数
          setFormData(prev => ({
            ...prev,
            people: res.data.data.minPeople
          }));
        } else {
          Toast.show({
            content: res.data.msg || '获取剧本信息失败'
          });
        }
      } catch (err) {
        console.error('获取剧本信息失败:', err);
        Toast.show({
          content: '获取剧本信息失败'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchScriptData();
  }, [location.state?.scriptId]);

  // 获取优惠券
  useEffect(() => {
    if (scriptData && formData.people > 0) {
      fetchAvailableCoupons();
    }
  }, [scriptData, formData.people]);

  // 优化获取优惠券的方法
  const fetchAvailableCoupons = async () => {
    try {
      const userId = '64e1b2c1f1a2b3c4d5e6f7a8'; // 测试用户ID
      const totalAmount = scriptData.price * formData.people;
      
      const res = await couponAPI.getAvailable({
        userId,
        totalAmount
      });
      
      if (res.data.code === 0) {
        setCoupons(res.data.data);
        // 如果当前选中的优惠券不在可用列表中，清除选择
        if (formData.coupon && !res.data.data.find(c => c._id === formData.coupon._id)) {
          setFormData(prev => ({ ...prev, coupon: null }));
        }
      }
    } catch (err) {
      console.error('获取优惠券失败:', err);
    }
  };

  // 计算总价
  const calculateTotal = () => {
    const originalTotal = scriptData.price * formData.people;
    const discount = formData.coupon?.amount || 0;
    return Math.max(0, originalTotal - discount);
  };

  const handlePeopleChange = (value) => {
    setFormData({
      ...formData,
      people: value
    });
  };

  const handleTimeSelect = (time) => {
    setFormData({
      ...formData,
      selectedTime: time
    });
  };

  const handleSubmit = async () => {
    if (!scriptData) {
      Toast.show({ content: '剧本信息加载失败' });
      return;
    }

    if (!formData.selectedTime) {
      Toast.show({ content: '请选择预约时间' });
      return;
    }

    const appointmentData = {
      user: '64e1b2c1f1a2b3c4d5e6f7a8', // 测试用户ID
      shop: scriptData.shop._id,
      script: scriptData._id,
      people: formData.people,
      date: formData.selectedDate,
      timeSlot: {
        label: formData.selectedTime.label,
        start: formData.selectedTime.label.split('~')[0],
        end: formData.selectedTime.label.split('~')[1]
      },
      pricePerPerson: scriptData.price,
      totalPrice: calculateTotal(),
      coupon: formData.coupon?._id,
      couponAmount: formData.coupon?.amount || 0,
      remark: formData.remark,
      phone: '15288888888' // 测试手机号
    };

    try {
      Toast.show({
        icon: 'loading',
        content: '提交中...',
        duration: 0
      });

      const res = await appointmentAPI.create(appointmentData);

      Toast.clear();

      if (res.data.code === 0) {
        Toast.show({
          icon: 'success',
          content: '预约成功'
        });
        // 跳转到订单详情页
        navigate(`/appointment-detail/${res.data.data._id}`);
      } else {
        Toast.show({
          icon: 'fail',
          content: res.data.msg || '预约失败'
        });
      }
    } catch (err) {
      Toast.clear();
      Toast.show({
        icon: 'fail',
        content: '网络错误，请重试'
      });
      console.error('预约失败:', err);
    }
  };

  // 处理优惠券选择
  const toggleCouponList = () => {
    setFormData(prev => ({
      ...prev,
      showCouponList: !prev.showCouponList
    }));
  };

  // 优惠券可用性检查
  const checkCouponAvailable = (coupon) => {
    const totalAmount = scriptData.price * formData.people;
    
    // 检查优惠券条件
    if (coupon.condition) {
      const minAmount = Number(coupon.condition.match(/满(\d+)元可用/)?.[1] || 0);
      if (totalAmount < minAmount) {
        Toast.show({
          content: `订单满${minAmount}元才可使用该优惠券`,
          position: 'bottom'
        });
        return false;
      }
    }

    // 检查优惠券有效期
    const expireDate = new Date(coupon.expiredAt);
    if (expireDate < new Date()) {
      Toast.show({
        content: '该优惠券已过期',
        position: 'bottom'
      });
      return false;
    }

    return true;
  };

  // 优化优惠券选择逻辑
  const selectCoupon = (coupon) => {
    if (formData.coupon?._id === coupon._id) {
      // 取消选择
      setFormData(prev => ({
        ...prev,
        coupon: null,
        showCouponList: false
      }));
    } else {
      // 选择新优惠券
      setFormData(prev => ({
        ...prev,
        coupon,
        showCouponList: false
      }));
      Toast.show({
        content: `已使用优惠券，为您节省${coupon.amount}元`,
        position: 'bottom'
      });
    }
  };

  // 加载状态展示
  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  // 数据加载失败处理
  if (!scriptData) {
    return <div className="error">剧本信息加载失败</div>;
  }

  // 优化优惠券列表展示
  const renderCouponList = () => {
    if (!coupons.length) {
      return (
        <div className="coupon-list">
          <div className="no-coupon-tip">暂无可用优惠券</div>
        </div>
      );
    }

    return (
      <div className="coupon-list">
        {coupons.map(coupon => (
          <div
            key={coupon._id}
            className={`coupon-item ${formData.coupon?._id === coupon._id ? 'selected' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              selectCoupon(coupon);
            }}
          >
            <div className="coupon-amount">¥{coupon.amount}</div>
            <div className="coupon-detail">
              <div className="coupon-name">{coupon.name}</div>
              <div className="coupon-condition">{coupon.condition || '无使用门槛'}</div>
              <div className="coupon-expire">
                有效期至 {new Date(coupon.expiredAt).toLocaleDateString()}
              </div>
            </div>
            <div className="coupon-select" />
          </div>
        ))}
      </div>
    );
  };

  // 优化优惠券展示区域
  const renderCouponCard = () => (
    <Card className="coupon-card" onClick={() => setFormData(prev => ({ ...prev, showCouponList: !prev.showCouponList }))}>
      <div className="coupon-header">
        <PayCircleOutline className="coupon-icon" />
        <span className="coupon-title">优惠券</span>
        <div className="coupon-value">
          {formData.coupon ? (
            <span className="selected-coupon">
              已减 ¥{formData.coupon.amount}
            </span>
          ) : (
            <span className="no-coupon">
              {coupons.length > 0 ? `${coupons.length}张可用` : '暂无可用'}
            </span>
          )}
          <DownOutline className={`arrow ${formData.showCouponList ? 'up' : ''}`} />
        </div>
      </div>
      {formData.showCouponList && renderCouponList()}
    </Card>
  );

  return (
    <div className="appointment-payment">
      <NavBar
        backArrow={<LeftOutline style={{ fontSize: '20px' }} />}
        onBack={() => navigate(-1)}
        style={{
          '--height': '44px',
          '--border-bottom': '1px solid #f0f0f0',
        }}
      >
        确认订单
      </NavBar>

      <div className="content">
        {/* 店铺信息 */}
        <Card className="shop-card">
          <div className="shop-header">
            <EnvironmentOutline className="shop-icon" />
            <div className="shop-info">
              <div className="shop-name">{scriptData.shop.name}</div>
              <div className="shop-address">
                {scriptData.shop.address}
                <span className="distance">{scriptData.shop.distance}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* 剧本信息 */}
        <Card className="script-card">
          <div className="script-header">
            <Image src={scriptData.image} className="script-image" />
            <div className="script-info">
              <h3>{scriptData.name}</h3>
              <div className="script-tags">
                {scriptData.tags.map((tag, index) => (
                  <Tag key={index} className="tag" fill="outline" color="primary">
                    {tag}
                  </Tag>
                ))}
              </div>
              <div className="script-meta">
                <span><UserOutline /> {scriptData.minPeople}-{scriptData.maxPeople}人</span>
                <span><ClockCircleOutline /> {scriptData.duration / 60}小时</span>
              </div>
            </div>
          </div>

          <Divider />

          {/* 价格信息 */}
          <div className="price-info">
            <div className="price-current">
              <span className="price">¥{scriptData.price}</span>
              <span className="original-price">¥{scriptData.originPrice}</span>
            </div>
            <div className="people-selector">
              <span>人数</span>
              <Stepper
                min={scriptData.minPeople}
                max={scriptData.maxPeople}
                value={formData.people}
                onChange={handlePeopleChange}
                className="stepper"
              />
            </div>
          </div>
        </Card>

        {/* 时间选择 */}
        <Card className="time-card" onClick={() => setShowTimePopup(true)}>
          <h3 className="card-title">开场时间</h3>
          <div className="time-select-row">
            <span>
              {formData.selectedTime?.label || (
                <span style={{ color: '#bbb' }}>请选择开场时间段</span>
              )}
            </span>
          </div>
        </Card>

        {/* 优惠券（只保留一次） */}
        {renderCouponCard()}

        {/* 备注（只保留一次） */}
        <Card className="remark-card">
          <h3 className="card-title">备注</h3>
          <TextArea
            placeholder="请输入备注信息（选填）"
            value={formData.remark}
            onChange={(val) => setFormData({ ...formData, remark: val })}
            rows={2}
            className="remark-input"
            maxLength={50}
            showCount
          />
        </Card>

        {/* 保障信息 */}
        <div className="guarantee">
          <CheckShieldOutline className="shield-icon" />
          <span>开场前凭手机号入场。预定成功后平台暂不支持修改订单，如需调整请联系客服。已过免核验起点时间，退款需商户审核同意。</span>
        </div>
      </div>

      {/* 时间选择弹窗 */}
      <TimeSelection
        visible={showTimePopup}
        onClose={() => setShowTimePopup(false)}
        onConfirm={(selectedTime) => {
          // 处理选中的时间
          setFormData(prev => ({
            ...prev,
            selectedTime
          }));
        }}
      />

      {/* 底部支付栏 */}
      <div className="bottom-bar">
        <div className="price-section">
          <div className="total-price">
            <span>合计：</span>
            <span className="amount">¥{calculateTotal()}</span>
            {formData.coupon && (
              <span className="discount">已减¥{formData.coupon.amount}</span>
            )}
          </div>
          {formData.coupon && (
            <div className="original-price">
              原价：¥{scriptData.price * formData.people}
            </div>
          )}
        </div>
        <Button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={!formData.selectedTime}
        >
          立即支付
        </Button>
      </div>
    </div>
  );
};

export default AppointmentPaymentZ;
