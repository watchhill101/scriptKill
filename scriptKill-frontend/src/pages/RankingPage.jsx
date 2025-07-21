import { useState, useEffect } from 'react';
// 移除Typography导入
import { Tabs, List, Avatar, Badge, NavBar, Space } from 'antd-mobile';
import './RankingPage.css';

const RankingPage = () => {
  // 模拟排行榜数据
  const [rankingData, setRankingData] = useState([
    { id: 1, name: '云画和光', score: 12531, avatar: 'https://dummyimage.com/100x100/ffb6c1/000000' },
    { id: 2, name: '云画和光', score: 15231, avatar: 'https://dummyimage.com/100x100/87ceeb/000000' },
    { id: 3, name: '云画和光', score: 11831, avatar: 'https://dummyimage.com/100x100/98fb98/000000' },
    { id: 4, name: '八角亭迷雾', score: 13531, avatar: 'https://dummyimage.com/100x100/f0e68c/000000' },
    { id: 5, name: '无人知晓', score: 9831, avatar: 'https://dummyimage.com/100x100/dda0dd/000000' },
    { id: 6, name: '彼岸的灯塔', score: 14231, avatar: 'https://dummyimage.com/100x100/87cefa/000000' },
    { id: 7, name: '终末之烬', score: 10531, avatar: 'https://dummyimage.com/100x100/fa8072/000000' },
    { id: 8, name: '八角亭迷雾', score: 12931, avatar: 'https://dummyimage.com/100x100/f0e68c/000000' },
    { id: 9, name: '无人知晓', score: 11231, avatar: 'https://dummyimage.com/100x100/dda0dd/000000' },
    { id: 10, name: '彼岸的灯塔', score: 13831, avatar: 'https://dummyimage.com/100x100/87cefa/000000' },
  ]);

  // 按score降序排序数据
  useEffect(() => {
    const sortedData = [...rankingData].sort((a, b) => b.score - a.score);
    setRankingData(sortedData);
  }, []);

  return (
    <div className="ranking-page">
      <NavBar className="navbar" backArrow={false} right={<Space></Space>}>
        <h3 className="navbar-title">剧本杀</h3>
      </NavBar>
      <div className="ranking-header">
        <h4 className="ranking-title">玩家排行</h4>
      </div>

      {/* 前三名展示区 */}
      <div className="top-three-container">
        <div className="rank-item second-place">
          <Avatar src={rankingData[1].avatar} className="rank-avatar second-avatar" />
          <div className="rank-name">{rankingData[1].name}</div>
          <div className="rank-score">{rankingData[1].score}</div>
        </div>

        <div className="rank-item first-place">
          <Avatar src={rankingData[0].avatar} className="rank-avatar first-avatar" />
          <div className="rank-name">{rankingData[0].name}</div>
          <div className="rank-score">{rankingData[0].score}</div>
        </div>

        <div className="rank-item third-place">
          <Avatar src={rankingData[2].avatar} className="rank-avatar third-avatar" />
          <div className="rank-name">{rankingData[2].name}</div>
          <div className="rank-score">{rankingData[2].score}</div>
        </div>
      </div>

      {/* 排行榜列表 */}
      <List className="ranking-list">
        {rankingData.slice(3).map((item, index) => (
          <List.Item key={item.id} className="ranking-list-item">
            <div className="list-rank">{index + 4}</div>
            <Avatar src={item.avatar} className="list-avatar" />
            <div className="list-info">
              <div className="list-name">{item.name}</div>
            </div>
            <div className="list-score">{item.score}</div>
          </List.Item>
        ))}
      </List>
    </div>
  );
};

export default RankingPage;