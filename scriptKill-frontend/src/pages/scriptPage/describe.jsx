import React from 'react';
import { Card, Image } from 'antd-mobile';

const Describe = () => {
  return (
    <div className="describe-container">
      <Card title="剧本详细介绍">
        <p>
          《云画和光》是一部以古代西蜀为背景的情感剧本杀。故事发生在一个风景如画的时代，
          主角们在西蜀相遇，经历了一系列的冒险和挑战。
        </p>
        <p>
          剧情围绕着几位主要角色展开，他们各自带着不同的目的和秘密，在旅途中相遇。
          随着故事的发展，他们之间的关系逐渐变得复杂，隐藏的真相也一一浮出水面。
        </p>
        <Image src="/api/placeholder/350/200" alt="剧情图片" />
        <h4>游戏特点</h4>
        <ul>
          <li>精心设计的古风场景和人物</li>
          <li>扣人心弦的剧情发展</li>
          <li>多结局设计，每次游戏体验都不同</li>
          <li>适合情感类剧本杀爱好者</li>
        </ul>
        <h4>游戏时长</h4>
        <p>约5-6小时，建议预留充足时间体验完整剧情</p>
      </Card>
    </div>
  );
};

export default Describe;