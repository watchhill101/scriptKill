import './RankingPage.css';
import { useState, useEffect } from 'react';

const RankingPage = () => {
  const [topThree, setTopThree] = useState([]);
  const [otherPlayers, setOtherPlayers] = useState([]);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/rankings');
        const data = await res.json();
        setTopThree(data.slice(0, 3));
        setOtherPlayers(data.slice(3));
      } catch (err) {
        console.error('获取排行榜数据失败:', err);
      }
    };

    fetchRankings();
  }, []);
  return (
    <div className="ranking-container">
      {/* 前三名区域 */}
      <div className="ranking-top-three">
        {topThree.map((item, index) => (
          <div key={item._id} className="top-player-item">
            <img 
              src={`https://i.pravatar.cc/100?img=${item.id}`} 
              alt={item.name} 
              className="top-avatar"
            />
            <div className="name">{item.name}</div>
            <div className="points">{item.points}分</div>
          </div>
        ))}
      </div>

      {/* 其他排名区域 */}
      <div className="ranking-list">
        {otherPlayers.map((item, index) => (
          <div key={item._id} className="player">
            <div className={`rank rank-${index + 4}`}>{index + 4}</div>
            <img 
              src={`https://i.pravatar.cc/100?img=${item.id}`} 
              alt={item.name} 
              className="avatar"
            />
            <div className="player-info">
              <div className="name">{item.name}</div>
              <div className="points">{item.points}分</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RankingPage;
