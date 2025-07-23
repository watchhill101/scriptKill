import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore } from '@fortawesome/free-solid-svg-icons';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; 
import './home.css';

const Home = () => {
  const carouselImages = [
    { id: 1, image: '../public/OIP-C.webp', alt: '轮播图 1' },
    { id: 2, image: '../public/OIP-A.webp', alt: '轮播图 2' },
    { id: 3, image: '../public/OIP-C.webp', alt: '轮播图 3' },
  ];

  const hotScripts = [
    { id: 1, name: '古堡谜案', image: '../public/OIP-C.webp' },
    { id: 2, name: '时空谋杀', image: '../public/OIP-A.webp' },
    { id: 3, name: '宫廷风云', image: '../public/OIP-C.webp' },
  ];

  return (
    <div className="home-container" style={{backgroundColor:'#433c3cff'}}>
      <header className="home-header" style={{display: 'flex', alignItems: 'center'}}>
        <button className="show-stores-btn" style={{marginLeft:'10px',marginBottom:'10px'}}>
          <FontAwesomeIcon icon={faStore} />
        </button>
        <span style={{fontSize: '20px',marginLeft:'10px'}}>Yar沉浸式剧本杀</span>
      </header>
      <Carousel autoPlay infiniteLoop showStatus={false} showThumbs={false}>
        {carouselImages.map((image) => (
          <div key={image.id}>
            <img src={image.image} alt={image.alt} style={{width:'100%',height:'200px'}}/>
          </div>
        ))}
      </Carousel>
     <div style={{display: 'flex', justifyContent: 'space-around'}}> 
       <button className="show-script-list-btn" style={{width:'100%',height:'100px',backgroundColor:'orange'}}>
        查看剧本列表
      </button>
      <button className="show-ranking-list-btn" style={{width:'100%',height:'100px',backgroundColor:'blue'}}>
        查看排行榜
      </button>
     </div>

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
    </div>
  );
};

export default Home;