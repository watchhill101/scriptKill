import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { useNavigate } from 'react-router-dom';
import './FloatingBall_Z.scss';

const FloatingBall_Z = () => {
  const navigate = useNavigate();
  const [lastTapTime, setLastTapTime] = useState(0);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  });

  // 计算可拖动范围
  useEffect(() => {
    const updateBounds = () => {
      setBounds({
        left: 0,
        top: 0,
        right: window.innerWidth - 70, // 减去悬浮球宽度
        bottom: window.innerHeight - 70 // 减去悬浮球高度
      });
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);

    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  const handleTap = () => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapTime;
    
    // 双击判断（间隔小于 300ms）
    if (tapLength < 300 && tapLength > 0) {
      navigate('/ZYC/LnitiateCarpooling_Z');
    }
    setLastTapTime(currentTime);
  };

  return (
    <Draggable
      bounds={bounds}
      defaultPosition={{ x: 280, y: 600 }}
      positionOffset={{ x: 0, y: 0 }}
    >
      <div className="floating-ball" onTouchStart={handleTap}>
        <div className="ball-content">
          <div className="icon">🚗</div>
          <span>发起拼车</span>
        </div>
      </div>
    </Draggable>
  );
};

export default FloatingBall_Z;