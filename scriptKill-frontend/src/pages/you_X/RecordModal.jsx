import React from 'react';
import './RecordModal.css';

export default function RecordModal({ script, onClose }) {
  return (
    <div className="modal-mask">
      <div className="modal-content">
        <div className="modal-title-row">
          <span className="modal-title">推理记录</span>
          <span className="modal-close" onClick={onClose}>×</span>
        </div>
        <div className="modal-form">
          <div className="modal-form-row">
            <span>年份</span>
            <input placeholder="请输入年份" />
          </div>
          <div className="modal-form-row">
            <span>日期</span>
            <input placeholder="请选择日期" type="date" />
          </div>
          <div className="modal-form-row">
            <span>时间</span>
            <input placeholder="请输入时间" />
          </div>
          <div className="modal-form-row">
            <span>人物</span>
            <input placeholder="请输入人物" />
          </div>
          <textarea className="modal-form-desc" placeholder="描述一下事件" />
        </div>
        <button className="modal-confirm-btn">确定</button>
      </div>
    </div>
  );
} 