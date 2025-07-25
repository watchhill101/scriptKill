// 拼车支付
import React, { useState, useEffect } from 'react';
import { NavBar, Button, Stepper, TextArea, Toast, Card, Tag, Image, Divider } from 'antd-mobile';
import { LeftOutline, EnvironmentOutline, ClockCircleOutline, UserOutline, PayCircleOutline, DownOutline, CheckShieldOutline } from 'antd-mobile-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { carGroupAPI, couponAPI } from '../../services/api_Z';
import dayjs from 'dayjs';
import './Carpool_payment_Z.scss';

const CarpoolPaymentZ = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [carpoolData, setCarpoolData] = useState(null);
    const [peopleCount, setPeopleCount] = useState(1);
    const [note, setNote] = useState('');
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [coupons, setCoupons] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [showCouponList, setShowCouponList] = useState(false);

    // 获取URL参数和传递的数据
    const searchParams = new URLSearchParams(location.search);
    const carId = searchParams.get('id');
    const passedData = location.state;

    useEffect(() => {
        initializeData();
        fetchCoupons();
    }, []);

    // 初始化数据
    const initializeData = () => {
        if (passedData?.carpoolData) {
            setCarpoolData(passedData.carpoolData);
        } else {
            // 如果没有传递数据，使用模拟数据
            setCarpoolData(mockCarpoolData);
        }
    };

    // 获取可用优惠券
    const fetchCoupons = async () => {
        try {
            const res = await couponAPI.getAvailable({
                userId: '657573010000000000000101',
                totalAmount: 136
            });
            if (res.data.code === 0) {
                setCoupons(res.data.data || []);
            }
        } catch (err) {
            console.error('获取优惠券失败:', err);
            // 使用模拟优惠券数据
            setCoupons(mockCoupons);
        }
    };

    // 计算价格
    const calculatePrice = () => {
        if (!carpoolData) return { total: 0, discount: 0, final: 0 };
        
        const unitPrice = carpoolData.script?.price || 136;
        const total = unitPrice * peopleCount;
        const discount = selectedCoupon ? selectedCoupon.amount : 0;
        const final = Math.max(0, total - discount);
        
        return { total, discount, final };
    };

    // 计算当前性别分布和剩余需求
    const getGenderDistribution = () => {
        if (!carpoolData) return { 
            remainingMale: 0, 
            remainingFemale: 0, 
            currentMale: 0, 
            currentFemale: 0,
            maxCanBuy: 0
        };
        
        const { requirements, currentPeople } = carpoolData;
        
        // 统计当前各性别人数
        const currentMale = currentPeople.filter(p => p.gender === 'male').length;
        const currentFemale = currentPeople.filter(p => p.gender === 'female').length;
        
        // 计算剩余需求
        const remainingMale = Math.max(0, requirements.male - currentMale);
        const remainingFemale = Math.max(0, requirements.female - currentFemale);
        
        // 计算最多可购买人数（剩余总数）
        const maxCanBuy = remainingMale + remainingFemale;
        
        return {
            remainingMale,
            remainingFemale,
            currentMale,
            currentFemale,
            maxCanBuy
        };
    };

    // 获取剩余位置（修改这个方法）
    const getRemainingSlots = () => {
        const genderDist = getGenderDistribution();
        return genderDist.maxCanBuy;
    };

    // 验证购买人数的性别分配是否合理
    const validateGenderAllocation = (count) => {
        const genderDist = getGenderDistribution();
        
        // 检查是否超出剩余总数
        if (count > genderDist.maxCanBuy) {
            return {
                valid: false,
                message: `最多只能购买${genderDist.maxCanBuy}个位置`
            };
        }
        
        // 检查性别分配是否可行
        const { remainingMale, remainingFemale } = genderDist;
        
        // 如果只剩男生位置或只剩女生位置
        if (remainingMale === 0 && count > remainingFemale) {
            return {
                valid: false,
                message: `只剩${remainingFemale}个女生位置`
            };
        }
        
        if (remainingFemale === 0 && count > remainingMale) {
            return {
                valid: false,
                message: `只剩${remainingMale}个男生位置`
            };
        }
        
        return { valid: true };
    };

    // 处理人数变化
    const handlePeopleCountChange = (value) => {
        const validation = validateGenderAllocation(value);
        
        if (!validation.valid) {
            Toast.show({
                icon: 'fail',
                content: validation.message
            });
            return;
        }
        
        setPeopleCount(value);
    };

    // 处理支付（修改验证逻辑）
    const handlePayment = async () => {
        if (!carpoolData) return;

        // 验证人数分配
        const validation = validateGenderAllocation(peopleCount);
        if (!validation.valid) {
            Toast.show({ icon: 'fail', content: validation.message });
            return;
        }

        const remainingSlots = getRemainingSlots();
        if (remainingSlots <= 0) {
            Toast.show({ icon: 'fail', content: '车队已满员，无法支付' });
            return;
        }
        
        if (peopleCount > remainingSlots) {
            Toast.show({ icon: 'fail', content: `剩余位置不足，只能预约${remainingSlots}人` });
            return;
        }

        setSubmitting(true);
        try {
            const genderDist = getGenderDistribution();
            
            // 构建性别分配策略
            let maleCount = 0;
            let femaleCount = 0;
            
            // 优先分配给需求更多的性别
            if (genderDist.remainingMale >= genderDist.remainingFemale) {
                maleCount = Math.min(peopleCount, genderDist.remainingMale);
                femaleCount = peopleCount - maleCount;
            } else {
                femaleCount = Math.min(peopleCount, genderDist.remainingFemale);
                maleCount = peopleCount - femaleCount;
            }

            const paymentData = {
                carId: carId || 'mock123',
                peopleCount,
                genderAllocation: { // 新增性别分配信息
                    male: maleCount,
                    female: femaleCount
                },
                note,
                couponId: selectedCoupon?._id,
                totalAmount: calculatePrice().final,
                userId: '657573010000000000000101',
                source: passedData?.source || 'group'
            };

            Toast.show({
                icon: 'loading',
                content: '支付中...',
                duration: 0
            });

            const res = await carGroupAPI.payment(paymentData);
            
            Toast.clear();
            
            if (res.data.code === 0) {
                Toast.show({
                    icon: 'success',
                    content: '支付成功！',
                    afterClose: () => {
                        navigate('/ZYC/StartCar_Z');
                    }
                });
            } else {
                Toast.show({ icon: 'fail', content: res.data.msg || '支付失败' });
            }

        } catch (err) {
            Toast.clear();
            console.error('支付失败:', err);
            Toast.show({ icon: 'fail', content: '支付失败，请重试' });
        } finally {
            setSubmitting(false);
        }
    };

    // 格式化时间
    const formatDateTime = (date, timeSlot) => {
        if (!date || !timeSlot) return '';
        const formattedDate = dayjs(date).format('YYYY-MM-DD');
        return `${formattedDate} ${timeSlot.start} ~ ${timeSlot.end}`;
    };

    // 计算时长
    const calculateDuration = (timeSlot) => {
        if (!timeSlot) return '5小时';
        const start = timeSlot.start.split(':').map(Number);
        const end = timeSlot.end.split(':').map(Number);
        let hours = end[0] - start[0];
        if (hours < 0) hours += 24;
        return `${hours}小时`;
    };

    // 处理优惠券选择
    const toggleCouponList = () => {
        setShowCouponList(!showCouponList);
    };

    const selectCoupon = (coupon) => {
        if (selectedCoupon?._id === coupon._id) {
            setSelectedCoupon(null);
        } else {
            setSelectedCoupon(coupon);
            Toast.show({
                content: `已使用优惠券，为您节省¥${coupon.amount}`,
                position: 'bottom'
            });
        }
        setShowCouponList(false);
    };

    // 渲染优惠券列表
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
                        className={`coupon-item ${selectedCoupon?._id === coupon._id ? 'selected' : ''}`}
                        onClick={() => selectCoupon(coupon)}
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

    const { total, discount, final } = calculatePrice();

    if (!carpoolData) {
        return (
            <div className="carpool-payment-z">
                <NavBar backArrow={<LeftOutline />} onBack={() => navigate(-1)}>
                    确认订单
                </NavBar>
                <div className="error">拼车信息加载失败</div>
            </div>
        );
    }

    return (
        <div className="carpool-payment-z">
            <NavBar 
                backArrow={<LeftOutline />} 
                onBack={() => navigate(-1)}
                className="nav-bar"
            >
                确认订单
            </NavBar>

            <div className="content">
                {/* 店铺信息 */}
                <Card className="shop-card">
                    <div className="shop-header">
                        <EnvironmentOutline className="shop-icon" />
                        <div className="shop-info">
                            <div className="shop-name">Yarn沉浸式剧本杀店</div>
                            <div className="shop-address">
                                北京市朝阳区建国路88号SOHO现代城
                                <span className="distance">1.2km</span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* 剧本信息 */}
                <Card className="script-card">
                    <div className="script-header">
                        <Image 
                            src={carpoolData.script?.image || '/堂主.png'} 
                            className="script-image" 
                            alt={carpoolData.script?.name}
                        />
                        <div className="script-info">
                            <h3>{carpoolData.script?.name}</h3>
                            <div className="script-tags">
                                {(carpoolData.script?.tags || []).map((tag, index) => (
                                    <Tag key={index} className="tag" fill="outline" color="primary">
                                        {tag}
                                    </Tag>
                                ))}
                            </div>
                            <div className="script-meta">
                                <span><UserOutline /> {carpoolData.maxPeople}人</span>
                                <span><ClockCircleOutline /> {Math.floor((carpoolData.script?.duration || 360) / 60)}小时</span>
                            </div>
                        </div>
                    </div>

                    <Divider />

                    {/* 价格和人数信息 */}
                    <div className="price-info">
                        <div className="price-current">
                            <span className="price">¥{carpoolData.script?.price || 136}</span>
                        </div>
                        <div className="people-selector">
                            <span>人数</span>
                            <Stepper
                                min={1}
                                max={getRemainingSlots()}
                                value={peopleCount}
                                onChange={handlePeopleCountChange} // 使用新的处理方法
                                className="stepper"
                            />
                        </div>
                    </div>
                </Card>

                {/* 性别需求提示 */}
                <Card className="gender-info-card">
                    <h3 className="card-title">性别需求</h3>
                    <div className="gender-requirements">
                        {(() => {
                            const genderDist = getGenderDistribution();
                            return (
                                <div className="requirements-display">
                                    <div className="requirement-item">
                                        <span className="label">还需男生：</span>
                                        <span className="count male">{genderDist.remainingMale}人</span>
                                    </div>
                                    <div className="requirement-item">
                                        <span className="label">还需女生：</span>
                                        <span className="count female">{genderDist.remainingFemale}人</span>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </Card>

                {/* 时间信息 */}
                <Card className="time-card">
                    <h3 className="card-title">开场时间</h3>
                    <div className="time-info">
                        <div className="time-display">
                            {formatDateTime(carpoolData.date, carpoolData.timeSlot)} ({calculateDuration(carpoolData.timeSlot)})
                        </div>
                    </div>
                </Card>

                {/* 拼车规则 */}
                <Card className="rules-card">
                    <h3 className="card-title">拼车须知</h3>
                    <div className="rules">
                        <div className="rule-item">
                            • 1人起订，还差{getRemainingSlots()}人可开场
                        </div>
                        <div className="rule-item">
                            • {formatDateTime(carpoolData.date, carpoolData.timeSlot).split(' ')[0]} 04：00前未达到拼车人数要求，系统将自动取消预约
                        </div>
                        <div className="rule-item">
                            • 开场前30分钟不可上车
                        </div>
                        <div className="rule-item">
                            • 购买多人票时将根据剩余性别需求自动分配
                        </div>
                    </div>
                </Card>

                {/* 优惠券 */}
                <Card className="coupon-card" onClick={toggleCouponList}>
                    <div className="coupon-header">
                        <PayCircleOutline className="coupon-icon" />
                        <span className="coupon-title">优惠券</span>
                        <div className="coupon-value">
                            {selectedCoupon ? (
                                <span className="selected-coupon">
                                    已减 ¥{selectedCoupon.amount}
                                </span>
                            ) : (
                                <span className="no-coupon">
                                    {coupons.length > 0 ? `${coupons.length}张可用` : '暂无可用'}
                                </span>
                            )}
                            <DownOutline className={`arrow ${showCouponList ? 'up' : ''}`} />
                        </div>
                    </div>
                    {showCouponList && renderCouponList()}
                </Card>

                {/* 备注 */}
                <Card className="remark-card">
                    <h3 className="card-title">备注</h3>
                    <TextArea
                        placeholder="将您的其他要求告知（选填）"
                        value={note}
                        onChange={setNote}
                        rows={2}
                        className="remark-input"
                        maxLength={50}
                        showCount
                    />
                </Card>

                {/* 保障信息 */}
                <div className="guarantee">
                    <CheckShieldOutline className="shield-icon" />
                    <span>开场前凭手机号入场。预定成功后，平台暂不支持修改订单，如您有问题请联系商家进行协商。已过免费核销截止时间，预订成功后申请退款需商户审核同意。</span>
                </div>
            </div>

            {/* 底部支付栏 */}
            <div className="bottom-bar">
                <div className="price-section">
                    <div className="total-price">
                        <span>合计：</span>
                        <span className="amount">¥{final}</span>
                        {selectedCoupon && (
                            <span className="discount">已减¥{selectedCoupon.amount}</span>
                        )}
                    </div>
                    {selectedCoupon && (
                        <div className="original-price">
                            原价：¥{total}
                        </div>
                    )}
                </div>
                <Button
                    className="submit-btn"
                    onClick={handlePayment}
                    loading={submitting}
                >
                    {submitting ? '支付中...' : '立即支付'}
                </Button>
            </div>
        </div>
    );
};

// 模拟数据
const mockCarpoolData = {
    _id: "mock123",
    script: {
        name: "云画和光",
        image: "/堂主.png",
        score: 8.0,
        price: 136,
        duration: 360,
        tags: ["古风", "还原", "情感"],
        level: "进阶"
    },
    date: "2022-12-11",
    timeSlot: {
        start: "00:00",
        end: "05:00"
    },
    maxPeople: 8,
    requirements: {
        male: 4,
        female: 4
    },
    currentPeople: [
        { user: { _id: "1", avatar: "/堂主.png" }, gender: "male" },
        { user: { _id: "2", avatar: "/堂主.png" }, gender: "female" },
        { user: { _id: "3", avatar: "/堂主.png" }, gender: "male" }
    ],
    status: "pending",
    heat: 4,
    fillRate: 50
};

const mockCoupons = [
    { 
        _id: 'coupon_001', 
        name: '新用户专享', 
        amount: 30, 
        condition: '满100元可用', 
        expiredAt: '2023-12-31' 
    },
    { 
        _id: 'coupon_002', 
        name: '周末特惠', 
        amount: 50, 
        condition: '满200元可用', 
        expiredAt: '2023-12-31' 
    },
];

export default CarpoolPaymentZ;
