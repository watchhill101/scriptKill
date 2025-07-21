import React from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleStartGame = () => {
    // 这里可以添加跳转到游戏选择页面的逻辑
    // 示例：跳转到登录页面，你可以根据实际情况修改
    navigate('/login');
  };

  const hotScripts = [
    { id: 1, name: '古堡谜案', image: 'https://via.placeholder.com/200x300?text=Script+1' },
    { id: 2, name: '时空谋杀', image: 'https://via.placeholder.com/200x300?text=Script+2' },
    { id: 3, name: '宫廷风云', image: 'https://via.placeholder.com/200x300?text=Script+3' },
  ];

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>欢迎来到剧本杀世界</h1>
        <p>探索神秘剧情，体验别样人生</p>
        {/* <button className="start-game-btn" onClick={handleStartGame}>
          开始游戏
        </button> */}
      </header>
      <section className="hot-scripts">
        <h2>热门剧本推荐</h2>
        <div className="script-list">
          {hotScripts.map((script) => (
            <div key={script.id} className="script-card">
              <img src={script.image} alt={script.name} />
              <h3>{script.name}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;