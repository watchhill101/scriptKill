import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ScriptTimelineDetail.css';
import RecordModal from './RecordModal';

const script = {
  id: 1,
  img: 'https://img2.baidu.com/it/u=1812345678,1234567890&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750',
  title: '云画和光',
  score: 8.0,
  desc: '那时，我们在西藏相遇。见过盛大的日出，行过壮阔雪域，攀过险峻的雪山。无数次毁灭重生...'
};
const events = [
  { id: 1, date: '2022-12-12', time: '00:00', person: '不染', desc: '第一次打卡实景本，有幸去了一家非常好的实景店！' },
  { id: 2, date: '2022-12-12', time: '00:00', person: '不染', desc: '第一次打卡实景本，有幸去了一家非常好的实景店！' },
  { id: 3, date: '2022-12-12', time: '00:00', person: '不染', desc: '第一次打卡实景本，有幸去了一家非常好的实景店！' },
];

export default function ScriptTimelineDetail() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="timeline-detail-container">
      <div className="timeline-header">
        <span className="header-back" onClick={() => navigate('/timeline')}>&#60;</span>
        <span className="timeline-title">剧本时间线</span>
        <div className="header-right">
          <span className="header-more">···</span>
          <span className="header-o">&#9416;</span>
        </div>
      </div>
      <div className="timeline-card">
        <img className="timeline-img" src={script.img} alt={script.title} />
        <div className="timeline-info">
          <div className="timeline-title-row">
            <span className="timeline-script-title">{script.title}</span>
            <span className="timeline-score">{script.score}分</span>
          </div>
          <div className="timeline-desc">{script.desc}</div>
          <button className="timeline-record-btn" onClick={() => setShowModal(true)}>记录</button>
        </div>
      </div>
      <div className="timeline-events">
        {events.map(event => (
          <div className="timeline-event" key={event.id}>
            <div className="timeline-event-dot" />
            <div className="timeline-event-info">
              <div className="timeline-event-meta">
                <span>{event.date} {event.time}</span>
                <span>{event.person}</span>
              </div>
              <div className="timeline-event-desc">{event.desc}</div>
            </div>
          </div>
        ))}
      </div>
      {showModal && <RecordModal script={script} onClose={() => setShowModal(false)} />}
    </div>
  );
} 