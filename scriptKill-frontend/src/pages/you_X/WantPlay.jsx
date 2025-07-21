import React from 'react';
import './WantPlay.css';

const scripts = [
  {
    id: 1,
    img: 'https://img2.baidu.com/it/u=1812345678,1234567890&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750',
    title: '云画和光',
    score: 8.0,
    tags: ['8人', '古风', '还原', '情感'],
    desc: '那时，我们在西藏相遇。见过盛大的日出，行过壮阔雪域，攀过险峻的雪山。一路来颠沛流离，无数次毁灭重生...'
  },
  {
    id: 2,
    img: 'https://img2.baidu.com/it/u=1812345678,1234567890&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750',
    title: '云画和光',
    score: 8.0,
    tags: ['8人', '古风', '还原', '情感'],
    desc: '那时，我们在西藏相遇。见过盛大的日出，行过壮阔雪域，攀过险峻的雪山。一路来颠沛流离，无数次毁灭重生...'
  },
  {
    id: 3,
    img: 'https://img2.baidu.com/it/u=1812345678,1234567890&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750',
    title: '云画和光',
    score: 8.0,
    tags: ['8人', '古风', '还原', '情感'],
    desc: '那时，我们在西藏相遇。见过盛大的日出，行过壮阔雪域，攀过险峻的雪山。一路来颠沛流离，无数次毁灭重生...'
  }
];

function WantPlay() {
  return (
    <div className="script-list-container">
      <div className="script-list-header">
        <span className="header-back">&#60;</span>
        <span className="script-list-title">想玩的本</span>
        <div className="header-right">
          <span className="header-more">···</span>
          <span className="header-o">&#9416;</span>
        </div>
      </div>
      <div className="script-list-content">
        {scripts.map(script => (
          <div className="script-card" key={script.id}>
            <img className="script-img" src={script.img} alt={script.title} />
            <div className="script-info">
              <div className="script-title-row">
                <span className="script-title">{script.title}</span>
                <span className="script-score">{script.score}分</span>
              </div>
              <div className="script-tags">
                {script.tags.map(tag => (
                  <span className="script-tag" key={tag}>{tag}</span>
                ))}
              </div>
              <div className="script-desc">{script.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WantPlay; 