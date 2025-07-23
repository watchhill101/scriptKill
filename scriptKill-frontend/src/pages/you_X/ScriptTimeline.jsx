import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ScriptTimeline.css';

const scripts = [
  {
    id: 1,
    img: 'https://img2.baidu.com/it/u=1812345678,1234567890&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750',
    title: '云画和光',
    score: 8.0,
    desc: '那时，我们在西藏相遇。见过盛大的日出，行过壮阔雪域，攀过险峻的雪山。无数次毁灭重生...'
  },
  {
    id: 2,
    img: 'https://img2.baidu.com/it/u=1812345678,1234567890&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750',
    title: '云画和光',
    score: 8.0,
    desc: '那时，我们在西藏相遇。见过盛大的日出，行过壮阔雪域，攀过险峻的雪山。无数次毁灭重生...'
  }
];

export default function ScriptTimeline() {
  const navigate = useNavigate();
  const handleDetail = (id) => {
    navigate(`/timeline/${id}`);
  };
  return (
    <div className="script-timeline-container">
      <div className="script-timeline-header">
        <span className="header-back" onClick={() => navigate('/profile')}>&#60;</span>
        <span className="timeline-title">剧本时间线</span>
        <div className="header-right">
          <span className="header-more">···</span>
          <span className="header-o">&#9416;</span>
        </div>
      </div>
      <div className="timeline-search">
        <input className="timeline-search-input" placeholder="输入剧本名" />
        <span className="timeline-search-icon">🔍</span>
      </div>
      <div className="timeline-list">
        {scripts.map(script => (
          <div className="timeline-card" key={script.id}>
            <img className="timeline-img" src={script.img} alt={script.title} />
            <div className="timeline-info">
              <div className="timeline-title-row">
                <span className="timeline-script-title">{script.title}</span>
                <span className="timeline-score">{script.score}分</span>
              </div>
              <div className="timeline-desc">{script.desc}</div>
              <div className="timeline-btns">
                <button className="timeline-detail-btn" onClick={() => handleDetail(script.id)}>详情</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}