// 拼车详情
import React, { useState, useEffect } from 'react';
import { NavBar, Button, Toast, Skeleton } from 'antd-mobile';
import { LeftOutline, ClockCircleOutline, TeamOutline, StarOutline, SendOutline } from 'antd-mobile-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { carGroupAPI, initiateCarAPI } from '../../services/api_Z';
import dayjs from 'dayjs';
import './Carpool_details_Z.scss';

const CarpoolDetailsZ = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [carpoolData, setCarpoolData] = useState(null);
    const [expanded, setExpanded] = useState(false);
    
    // 获取URL中的参数
    const searchParams = new URLSearchParams(location.search);
    const carId = searchParams.get('id');
    const source = searchParams.get('source'); // 添加来源参数，区分是发起拼车还是找车
    
    useEffect(() => {
        fetchCarpoolDetails();
    }, []);
    
    const fetchCarpoolDetails = async () => {
        if (!carId) {
            // 使用测试数据
            setTimeout(() => {
                setCarpoolData(mockData);
                setLoading(false);
            }, 500);
            return;
        }
        
        try {
            setLoading(true);
            // 根据来源选择不同的API
            const res = source === 'initiate' ? 
                await initiateCarAPI.getDetail(carId) : 
                await carGroupAPI.getDetail(carId);
                
            if (res.data.code === 0) {
                setCarpoolData(res.data.data);
            } else {
                Toast.show({
                    icon: 'fail',
                    content: res.data.msg || '获取拼车详情失败'
                });
            }
        } catch (err) {
            console.error('获取拼车详情失败:', err);
            Toast.show({
                icon: 'fail',
                content: '网络错误，请重试'
            });
            // 使用测试数据
            setCarpoolData(mockData);
        } finally {
            setLoading(false);
        }
    };
    
    // 计算详细的性别需求信息
    const getGenderRequirements = () => {
        if (!carpoolData) return { isFull: false, remainingMale: 0, remainingFemale: 0 };
        
        const { requirements, currentPeople, maxPeople } = carpoolData;
        
        // 统计当前各性别人数
        const currentMale = currentPeople.filter(p => p.gender === 'male').length;
        const currentFemale = currentPeople.filter(p => p.gender === 'female').length;
        
        // 计算剩余需求
        const remainingMale = Math.max(0, requirements.male - currentMale);
        const remainingFemale = Math.max(0, requirements.female - currentFemale);
        
        // 检查是否满员
        const isFull = currentPeople.length >= maxPeople || (remainingMale === 0 && remainingFemale === 0);
        
        return {
            isFull,
            remainingMale,
            remainingFemale,
            currentMale,
            currentFemale,
            currentTotal: currentPeople.length,
            maxPeople
        };
    };
    
    const handleJoin = () => {
        const genderInfo = getGenderRequirements();
        
        // 检查是否满员
        if (genderInfo.isFull) {
            Toast.show({
                icon: 'fail',
                content: '车队已满员，无法加入'
            });
            return;
        }
        
        // 携带拼车数据到支付页面
        navigate(`/ZYC/Carpool_payment_Z?id=${carId || '123'}`, {
            state: {
                carpoolData: carpoolData,
                source: source
            }
        });
    };
    
    const formatTime = (date, timeSlot) => {
        if (!date || !timeSlot) return '';
        const formattedDate = dayjs(date).format('YYYY-MM-DD');
        return `${formattedDate} ${timeSlot.start} ~ ${timeSlot.end}`;
    };
    
    const calculateTimeLength = (timeSlot) => {
        if (!timeSlot) return '';
        const start = timeSlot.start.split(':').map(Number);
        const end = timeSlot.end.split(':').map(Number);
        let hours = end[0] - start[0];
        if (hours < 0) hours += 24; // 处理跨天的情况
        return `(${hours}小时)`;
    };
    
    const getRemainingPeople = () => {
        if (!carpoolData) return 0;
        return carpoolData.maxPeople - (carpoolData.currentPeople?.length || 0);
    };
    
    return (
        <div className="carpool-details-z">
            <NavBar
                backArrow={<LeftOutline />}
                onBack={() => navigate(-1)}
                className="nav-bar"
                right={<div style={{ fontSize: 20 }}>···</div>}
            >
                拼车详情
            </NavBar>
            
            {loading ? (
                <Skeleton animated className="script-info" />
            ) : carpoolData ? (
                <>
                    {/* 剧本信息 */}
                    <div className="script-info">
                        <div className="header">
                            <img 
                                className="cover" 
                                src={carpoolData.script?.image || '/堂主.png'} 
                                alt={carpoolData.script?.name || '剧本封面'} 
                            />
                            <div className="info">
                                <div>
                                    <div className="title-row">
                                        <span className="name">{carpoolData.script?.name}</span>
                                        <span className="score">{carpoolData.script?.score?.toFixed(1)}分</span>
                                    </div>
                                    
                                    <div className="people-info">
                                        {carpoolData.maxPeople}人 · {carpoolData.requirements?.male}男{carpoolData.requirements?.female}女
                                    </div>
                                    
                                    <div className="tags">
                                        {(carpoolData.script?.tags || []).map((tag, index) => (
                                            <span className="tag" key={index}>{tag}</span>
                                        ))}
                                    </div>
                                    
                                    <div className="details">
                                        <div className="detail-item">
                                            <TeamOutline className="icon" />
                                            <span className="text">{carpoolData.maxPeople}人</span>
                                        </div>
                                        <div className="detail-item">
                                            <ClockCircleOutline className="icon" />
                                            <span className="text">
                                                {carpoolData.script?.duration ? `${Math.floor(carpoolData.script.duration / 60)}-${Math.ceil(carpoolData.script.duration / 60)}小时` : '5-6小时'}
                                            </span>
                                        </div>
                                        <div className="detail-item">
                                            <StarOutline className="icon" />
                                            <span className="text">{carpoolData.script?.level || '进阶'}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="price">
                                    ¥{carpoolData.script?.price || 136}
                                    <span className="unit">/人起</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="time-info">
                            开场时间: {formatTime(carpoolData.date, carpoolData.timeSlot)} {calculateTimeLength(carpoolData.timeSlot)}
                        </div>
                    </div>
                    
                    {/* 车队状态 */}
                    <div className="car-status">
                        <div className="status-header">
                            <div className="title">车队状态</div>
                            {(() => {
                                const genderInfo = getGenderRequirements();
                                return (
                                    <div className={`status-badge ${genderInfo.isFull ? 'full' : 'available'}`}>
                                        {genderInfo.isFull ? '已满员' : '仍可上车'}
                                    </div>
                                );
                            })()}
                        </div>
                        
                        <div className="members">
                            <div className="avatar-group">
                                {(carpoolData.currentPeople || []).slice(0, 6).map((person, index) => (
                                    <div className="avatar-wrapper" key={index}>
                                        <img src={person.user?.avatar || '/堂主.png'} alt="用户头像" />
                                        <div className={`gender-indicator ${person.gender}`}>
                                            {person.gender === 'male' ? '♂' : '♀'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {(() => {
                                const genderInfo = getGenderRequirements();
                                return (
                                    <div className="status-text">
                                        {genderInfo.isFull ? (
                                            <span className="full-text">车队已满员 ({genderInfo.currentTotal}/{genderInfo.maxPeople})</span>
                                        ) : (
                                            <div className="remaining-text">
                                                <div className="current-count">
                                                    已加入{genderInfo.currentTotal}人 ({genderInfo.currentMale}男{genderInfo.currentFemale}女)
                                                </div>
                                                <div className="remaining-need">
                                                    {genderInfo.remainingMale > 0 && (
                                                        <span className="male-need">还缺{genderInfo.remainingMale}男</span>
                                                    )}
                                                    {genderInfo.remainingFemale > 0 && (
                                                        <span className="female-need">还缺{genderInfo.remainingFemale}女</span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                    
                    {/* 剧本简介 */}
                    <div className="script-intro">
                        <div className="title">剧本简介</div>
                        <div className="content">
                            {carpoolData.script?.introduction ? (
                                expanded ? (
                                    <>
                                        {carpoolData.script.introduction}
                                        <span className="expand-btn" onClick={() => setExpanded(false)}>收起</span>
                                    </>
                                ) : (
                                    <>
                                        {carpoolData.script.introduction.length > 100 ? 
                                            `${carpoolData.script.introduction.substring(0, 100)}...` : 
                                            carpoolData.script.introduction
                                        }
                                        {carpoolData.script.introduction.length > 100 && (
                                            <span className="expand-btn" onClick={() => setExpanded(true)}>展开</span>
                                        )}
                                    </>
                                )
                            ) : (
                                expanded ? (
                                    <>
                                        那时，我们在西藏相遇。见过盛大的日出，行过壮阔雪域，攀过险峻的雪山。一路来颠沛流离，无数次生死重生，终于证明存在的意义是信任和爱。复杂的是我们的人生，简单的是我们的相遇。
                                        <span className="expand-btn" onClick={() => setExpanded(false)}>收起</span>
                                    </>
                                ) : (
                                    <>
                                        那时，我们在西藏相遇。见过盛大的日出，行过壮阔雪域，攀过险峻的雪山。一路来颠沛流离，无数次生死重生，终于证明存在的意义是信任和...
                                        <span className="expand-btn" onClick={() => setExpanded(true)}>展开</span>
                                    </>
                                )
                            )}
                        </div>
                    </div>
                    
                    {/* 底部按钮 */}
                    <div className="bottom-actions">
                        {(() => {
                            const genderInfo = getGenderRequirements();
                            return (
                                <Button
                                    block
                                    color="primary"
                                    className="join-btn"
                                    onClick={handleJoin}
                                    disabled={genderInfo.isFull}
                                >
                                    {genderInfo.isFull ? '车队已满员' : '我要上车'}
                                </Button>
                            );
                        })()}
                    </div>
                </>
            ) : (
                <div style={{ padding: 20, textAlign: 'center' }}>
                    加载失败，请重试
                </div>
            )}
        </div>
    );
};

// 修改模拟数据，添加剧本简介
const mockData = {
    _id: "mock123",
    script: {
        name: "云画和光",
        image: "/堂主.png",
        score: 8.0,
        price: 136,
        duration: 360, // 6小时
        tags: ["古风", "还原", "情感"],
        level: "进阶",
        introduction: "那时，我们在西藏相遇。见过盛大的日出，行过壮阔雪域，攀过险峻的雪山。一路来颠沛流离，无数次生死重生，终于证明存在的意义是信任和爱。复杂的是我们的人生，简单的是我们的相遇。在这个关于信仰与坚持的故事里，每个人都在寻找着属于自己的那份纯真与美好。"
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
        { user: { _id: "3", avatar: "/堂主.png" }, gender: "male" },
        { user: { _id: "4", avatar: "/堂主.png" }, gender: "female" }
    ],
    status: "pending",
    heat: 4,
    fillRate: 50
};

export default CarpoolDetailsZ;
