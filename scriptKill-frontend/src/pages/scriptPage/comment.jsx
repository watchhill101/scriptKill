import React from 'react';
import { List, Avatar, Rate } from 'antd-mobile';

const Comment = () => {
  // Mock data for comments
  const comments = [
    {
      id: 1,
      user: '用户1',
      avatar: '/api/placeholder/40/40',
      rating: 4.5,
      date: '2025-07-15',
      content: '这个剧本非常好玩，角色设计很有深度，情节也很吸引人。推荐给喜欢古风题材的玩家！',
    },
    {
      id: 2,
      user: '用户2',
      avatar: '/api/placeholder/40/40',
      rating: 5,
      date: '2025-07-10',
      content: '剧情紧凑，人物关系复杂但不混乱，玩了一次就爱上了，期待再次体验！',
    },
    {
      id: 3,
      user: '用户3',
      avatar: '/api/placeholder/40/40',
      rating: 3.5,
      date: '2025-07-05',
      content: '整体不错，但是有些情节设计可以更合理一些。',
    },
  ];

  return (
    <div className="comments-container">
      <List header="用户评价">
        {comments.map(comment => (
          <List.Item
            key={comment.id}
            prefix={<Avatar src={comment.avatar} />}
            title={
              <div className="comment-header">
                <span className="comment-user">{comment.user}</span>
                <span className="comment-date">{comment.date}</span>
              </div>
            }
            description={
              <div className="comment-content">
                <Rate readOnly value={comment.rating} />
                <p>{comment.content}</p>
              </div>
            }
          />
        ))}
      </List>
    </div>
  );
};

export default Comment;