import React from 'react';
import './RecordModal.css';

export default function RecordModal({ script, onClose }) {
  return (
    <div className="modal-mask">
      <div className="modal-content">
        {/* 修改标题栏样式 */}
        <div className="modal-title-row">
          <span className="modal-title">推理记录</span>
          <span className="modal-close" onClick={onClose}>×</span>
        </div>
        <div className="modal-form">
          {/* 年份输入框 */}
          <div className="modal-form-row">
            <span>年份</span>
            <input placeholder="请输入年份" className="form-input" />
          </div>
          {/* 日期输入框 */}
          <div className="modal-form-row">
            <span>日期</span>
            <input placeholder="请选择日期" type="text" className="form-input" />
          </div>
          {/* 时间输入框 */}
          <div className="modal-form-row">
            <span>时间</span>
            <input placeholder="请输入时间" className="form-input" />
          </div>
          {/* 人物输入框 */}
          <div className="modal-form-row">
            <span>人物</span>
            <input placeholder="请输入人物" className="form-input" />
          </div>
          {/* 事件描述文本域 */}
          <textarea 
            className="modal-form-desc"
            placeholder="描述一下事件"
          />
        </div>
        {/* 底部确认按钮 */}
        <button className="modal-confirm-btn">确定</button>
      </div>
    </div>
  );
}