import React, { useState, useEffect } from 'react';
import { Popup, Button } from 'antd-mobile';
import { CloseOutline } from 'antd-mobile-icons';
import './TimeSelection_Z.scss';

// 预设时间段数据
const TIME_LIST = [
  { label: '00:00~05:00', price: 136, available: true },
  { label: '01:00~06:00', price: 136, available: true },
  { label: '02:00~07:00', price: 136, available: true },
  { label: '03:00~08:00', price: 136, available: true },
];

const TimeSelection = ({ visible, onClose, onConfirm }) => {
  // 选中的时间段索引
  const [selectedIdx, setSelectedIdx] = useState(null);

  // 弹窗关闭时重置选中状态
  useEffect(() => {
    if (!visible) {
      setSelectedIdx(null);
    }
  }, [visible]);

  // 处理时间段选择
  const handleSelect = (idx) => {
    if (TIME_LIST[idx].available) {
      setSelectedIdx(idx === selectedIdx ? null : idx);
    }
  };

  // 处理确认选择
  const handleConfirm = () => {
    if (selectedIdx !== null) {
      const selectedTime = TIME_LIST[selectedIdx];
      onConfirm({
        label: selectedTime.label,
        price: selectedTime.price,
        start: selectedTime.label.split('~')[0],
        end: selectedTime.label.split('~')[1]
      });
      onClose(); // 选择后关闭弹窗
    }
  };

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyStyle={{ 
        borderRadius: '16px 16px 0 0', 
        padding: 0,
        maxHeight: '70vh',
        overflowY: 'auto'
      }}
    >
      <div className="time-popup">
        <div className="time-popup-header">
          <span className="title">请选择开场时间</span>
          <CloseOutline className="close-btn" onClick={onClose} />
        </div>
        
        <div className="time-popup-list">
          {TIME_LIST.map((item, idx) => (
            <div
              key={item.label}
              className={`time-popup-item ${
                selectedIdx === idx ? 'selected' : ''
              } ${!item.available ? 'disabled' : ''}`}
              onClick={() => handleSelect(idx)}
            >
              <span className="time-label">{item.label}</span>
              <span className="price">￥{item.price} /人</span>
            </div>
          ))}
        </div>

        <Button
          block
          className={`time-popup-confirm ${selectedIdx !== null ? 'active' : ''}`}
          onClick={handleConfirm}
          disabled={selectedIdx === null}
        >
          确定
        </Button>
      </div>
    </Popup>
  );
};

export default TimeSelection;
