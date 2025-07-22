import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore } from '@fortawesome/free-solid-svg-icons';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; 
import './home.css';

// 模拟最近店铺数据
const mockNearbyStores = [
  { id: 1, name: '欢乐剧本杀店', distance: '0.8 km' },
  { id: 2, name: '梦幻剧情馆', distance: '1.5 km' },
  { id: 3, name: '奇妙剧本空间', distance: '2.2 km' },
];

// 轮播图数据
const carouselImages = [
  { id: 1, image: '../public/OIP-C.webp', alt: '轮播图 1' },
  { id: 2, image: '../public/OIP-A.webp', alt: '轮播图 2' },
  { id: 3, image: '../public/OIP-C.webp', alt: '轮播图 3' },
];

// 模拟剧本列表数据
const scriptList = [
  { id: 1, name: '神秘庄园', type: '悬疑' },
  { id: 2, name: '英雄传说', type: '冒险' },
  { id: 3, name: '魔法世界', type: '奇幻' },
];

// 模拟排行榜数据
const rankingList = [
  { id: 1, name: '古堡谜案', score: 9.5 },
  { id: 2, name: '时空谋杀', score: 9.2 },
  { id: 3, name: '宫廷风云', score: 9.0 },
];

const Home = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  // 新增状态，用于记录当前显示的模态框类型
  const [modalType, setModalType] = useState('');

  const hotScripts = [
    { id: 1, name: '古堡谜案', image: '../public/OIP-C.webp' },
    { id: 2, name: '时空谋杀', image: '../public/OIP-A.webp' },
    { id: 3, name: '宫廷风云', image: '../public/OIP-C.webp' },
  ];

  const handleShowStores = () => {
    setShowModal(true);
    setModalType('stores');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalType('');
  };

  // 点击显示剧本列表模态框
  const handleShowScriptList = () => {
    setShowModal(true);
    setModalType('scriptList');
  };

  // 点击显示排行榜模态框
  const handleShowRankingList = () => {
    setShowModal(true);
    setModalType('rankingList');
  };

  return (
    <div className="home-container" style={{backgroundColor:'#433c3cff'}}>
      <header className="home-header" style={{display: 'flex', alignItems: 'center'}}>
        <button className="show-stores-btn" onClick={handleShowStores} style={{marginLeft:'10px',marginBottom:'10px'}}>
          <FontAwesomeIcon icon={faStore} />
        </button>
        <span style={{fontSize: '20px',marginLeft:'10px'}}>Yar沉浸式剧本杀</span>
      </header>
      {/* 轮播图组件，设置 showThumbs 为 false 隐藏缩略图 */}
      <Carousel autoPlay infiniteLoop showStatus={false} showThumbs={false}>
        {carouselImages.map((image) => (
          <div key={image.id}>
            <img src={image.image} alt={image.alt} style={{width:'100%',height:'200px'}}/>
          </div>
        ))}
      </Carousel>
      {/* 点击显示剧本列表 */}
     <div style={{display: 'flex', justifyContent: 'space-around'}}> <button className="show-script-list-btn" onClick={handleShowScriptList} style={{width:'100%',height:'100px',backgroundColor:'orange'}}>
        查看剧本列表
      </button>
      {/* 点击显示排行榜 */}
      <button className="show-ranking-list-btn" onClick={handleShowRankingList} style={{width:'100%',height:'100px',backgroundColor:'blue'}}>
        查看排行榜
      </button></div>

       <div style={{textAlign: 'center', marginTop: '20px'}}>
        <h2 style={{fontSize: '16px'}}>热门剧本推荐</h2>
        <div className="script-list" style={{display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center'}}>
          {hotScripts.map((script) => (
            <div key={script.id} className="script-card">
              <img src={script.image} alt={script.name} style={{width:'100px',height:'100px'}}/>
              <h3 style={{fontSize: '15px'}}>{script.name}</h3>
            </div>
          ))}
        </div>
       </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-btn" onClick={handleCloseModal}>
              ×
            </button>
            {modalType === 'stores' && (
              <>
                <h2>最近的店铺</h2>
                <ul className="store-list">
                  {mockNearbyStores.map((store) => (
                    <li key={store.id}>
                      {store.name} - 距离: {store.distance}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {modalType === 'scriptList' && (
              <>
                <h2>剧本列表</h2>
                <ul className="script-list-ul">
                  {scriptList.map((script) => (
                    <li key={script.id}>
                      {script.name} - {script.type}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {modalType === 'rankingList' && (
              <>
                <h2>排行榜</h2>
                <ul className="ranking-list-ul">
                  {rankingList.map((item) => (
                    <li key={item.id}>
                      {item.name} - 评分: {item.score}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;