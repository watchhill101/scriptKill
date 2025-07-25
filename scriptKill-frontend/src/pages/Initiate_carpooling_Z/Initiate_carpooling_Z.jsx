// 拼车详情
import React, { useState, useEffect } from 'react';
import { NavBar, Button, Toast, Tabs, PullToRefresh, InfiniteScroll } from 'antd-mobile';
import { LeftOutline, CheckCircleFill } from 'antd-mobile-icons';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { initiateCarAPI, scriptAPI } from '../../services/api_Z';
import StickyBox from 'react-sticky-box';
import './Initiate_carpooling_Z.scss';

const filterTags = ['全部', '古风', '还原', '情感', '欢乐', '阵营', '民国', '推理'];

// 自定义loading组件
const LoadingSpinner = ({ text = '加载中', size = 'small' }) => (
  <div className={`loading-spinner ${size}`}>
    <div className="spinner-icon">
      <div className="spinner-dot"></div>
      <div className="spinner-dot"></div>
      <div className="spinner-dot"></div>
    </div>
    <span className="loading-text">{text}</span>
  </div>
);

const getNext30Days = () => {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const arr = [];
  for (let i = 0; i < 30; i++) {
    const date = dayjs().add(i, 'day');
    const dayOfWeek = date.day();
    arr.push({
      label: i === 0 ? '今天' : i === 1 ? '明天' : weekdays[dayOfWeek],
      date: date.format('YYYY-MM-DD'),
      show: date.format('MM-DD'),
      isToday: i === 0,
    });
  }
  return arr;
};

const InitiateCarpoolingZ = () => {
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState(getNext30Days()[0].date);
  const [activeTag, setActiveTag] = useState('全部');
  const [selectedScriptId, setSelectedScriptId] = useState('');
  const [loading, setLoading] = useState(false);
  const [scriptsLoading, setScriptsLoading] = useState(false);
  const [scriptList, setScriptList] = useState([]);
  
  // 分页相关状态
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const pageSize = 10;

  // 获取剧本列表
  const fetchScripts = async (tag = '全部', page = 1, isRefresh = false) => {
    // 设置loading状态
    if (isRefresh) {
      setRefreshing(true);
    } else if (page === 1) {
      setScriptsLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const res = await scriptAPI.getList({ 
        tag: tag === '全部' ? '' : tag,
        page,
        pageSize 
      });
      
      if (res.data.code === 0) {
        const newData = res.data.data || [];
        const pagination = res.data.pagination;
        
        if (page === 1 || isRefresh) {
          // 首次加载或刷新时替换数据
          setScriptList(newData);
          setCurrentPage(1);
          // 如果首次加载有数据，选中第一个
          if (newData.length > 0 && (!selectedScriptId || isRefresh)) {
            setSelectedScriptId(newData[0]._id);
          }
        } else {
          // 上拉加载时追加数据
          setScriptList(prev => [...prev, ...newData]);
          setCurrentPage(page);
        }
        
        // 根据后端返回的分页信息判断是否还有更多数据
        setHasMore(pagination?.hasMore || false);
        
      } else {
        Toast.show({ content: res.data.msg || '获取剧本列表失败' });
      }
    } catch (err) {
      console.error('获取剧本列表失败:', err);
      Toast.show({ content: '网络错误，请重试' });
      
      // 错误时恢复hasMore状态
      if (page > 1) {
        setHasMore(true);
      }
    } finally {
      // 清除所有loading状态
      setScriptsLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  // 下拉刷新
  const handleRefresh = async () => {
    await fetchScripts(activeTag, 1, true);
  };

  // 上拉加载更多
  const loadMore = async () => {
    if (!hasMore || loadingMore) return;
    const nextPage = currentPage + 1;
    await fetchScripts(activeTag, nextPage, false);
  };

  // 标签切换时重新加载数据
  const handleTagChange = (tag) => {
    setActiveTag(tag);
    setScriptList([]);
    setSelectedScriptId('');
    setCurrentPage(1);
    setHasMore(true);
  };

  useEffect(() => {
    fetchScripts(activeTag, 1);
  }, [activeTag]);

  // 选中的剧本
  const selectedScript = scriptList.find(s => s._id === selectedScriptId);

  // 发起拼车
  const handleInitiate = async () => {
    if (!selectedScript) {
      return Toast.show({ content: '请选择一个剧本' });
    }

    setLoading(true);
    try {
      const res = await initiateCarAPI.create({
        script: {
          name: selectedScript.name,
          image: selectedScript.image || '/堂主.png',
          score: selectedScript.score || 8.0,
          price: selectedScript.price || 136,
          duration: selectedScript.duration || 360,
          tags: selectedScript.tags || ['古风', '还原'],
          level: selectedScript.level || '进阶',
          // 添加剧本简介
          introduction: selectedScript.introduction || ''
        },
        date: activeDay,
        timeSlot: {
          start: '14:00',
          end: '20:00'
        },
        maxPeople: 8,
        requirements: { 
          male: 4, 
          female: 4 
        },
        userId: '657573010000000000000101'
      });
      
      if (res.data.code === 0) {
        Toast.show({ icon: 'success', content: '发车成功' });
        // 添加来源参数，表明来自发起拼车
        navigate(`/ZYC/Carpool_details_Z?id=${res.data.data._id}&source=initiate`);
      } else {
        Toast.show({ icon: 'fail', content: res.data.msg || '发车失败' });
      }
    } catch (err) {
      console.error('发起拼车失败:', err);
      Toast.show({ icon: 'fail', content: '网络错误，请重试' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="initiate-carpooling-z">
      <NavBar
        backArrow={<LeftOutline />}
        onBack={() => navigate(-1)}
        className="nav-bar"
      >
        发起拼车
      </NavBar>

      {/* 日期选择 */}
      <div className="date-scroll">
        <div className="date-container">
          {getNext30Days().map(day => (
            <div
              key={day.date}
              className={`date-item${activeDay === day.date ? ' active' : ''}`}
              onClick={() => setActiveDay(day.date)}
            >
              <div className="label">{day.label}</div>
              <div className="date">{day.show}</div>
              {activeDay === day.date && <div className="underline" />}
            </div>
          ))}
        </div>
      </div>

      {/* 剧本类型 Tabs */}
      <StickyBox offsetTop={0} offsetBottom={20}>
        <div className="tabs-container">
          <Tabs
            activeKey={activeTag}
            onChange={handleTagChange} 
            className="script-tabs"
          >
            {filterTags.map(tag => (
              <Tabs.Tab title={tag} key={tag} />
            ))}
          </Tabs>
        </div>
      </StickyBox>

      {/* 剧本列表 - 添加下拉刷新和上拉加载 */}
      <div className="script-list-container">
        <PullToRefresh
          onRefresh={handleRefresh}
          pullingText={false}  // 不显示默认文字
          canReleaseText={false}
          refreshingText={false}
          completeText={false}
          renderText={(status) => {
            switch (status) {
              case 'pulling':
                return null; // 下拉时不显示任何内容
              case 'canRelease':
                return <LoadingSpinner text="松开刷新" size="small" />;
              case 'refreshing':
                return <LoadingSpinner text="正在刷新" size="small" />;
              case 'complete':
                return (
                  <div className="refresh-complete">
                    <span>✓ 刷新完成</span>
                  </div>
                );
              default:
                return null;
            }
          }}
        >
          <div className="script-list">
            {scriptsLoading && currentPage === 1 ? (
              <div className="loading-container">
                <LoadingSpinner text="加载中" size="large" />
              </div>
            ) : scriptList.length === 0 && !scriptsLoading ? (
              <div className="empty-container">
                <div className="empty-icon">📚</div>
                <div className="empty-text">暂无符合条件的剧本</div>
                <div className="empty-subtitle">下拉可以刷新</div>
              </div>
            ) : (
              <>
                {scriptList.map(script => (
                  <div
                    key={script._id}
                    className={`script-item${selectedScriptId === script._id ? ' selected' : ''}`}
                    onClick={() => setSelectedScriptId(script._id)}
                  >
                    <img className="cover" src={script.image || '/堂主.png'} alt={script.name} />
                    <div className="info">
                      <div className="title-row">
                        <span className="name">{script.name}</span>
                        <span className="score">{script.score || 8.0}分</span>
                        {selectedScriptId === script._id && (
                          <CheckCircleFill className="selected-icon" color="#1677ff" fontSize={20} />
                        )}
                      </div>
                      <div className="tags">
                        {(script.tags || []).map(tag => (
                          <span className="tag" key={tag}>{tag}</span>
                        ))}
                      </div>
                      <div className="desc">
                        <span>8人</span>
                        <span className="divider">|</span>
                        <span>{Math.floor((script.duration || 360) / 60)}小时</span>
                        <span className="divider">|</span>
                        <span>{script.level || '进阶'}</span>
                      </div>
                      <div className="price">
                        <span>¥{script.price || 136}</span>
                        <span className="unit">/人起</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* 无限滚动加载更多 */}
                <InfiniteScroll 
                  loadMore={loadMore} 
                  hasMore={hasMore}
                  threshold={10}
                >
                  {loadingMore ? (
                    <LoadingSpinner text="加载更多" size="small" />
                  ) : hasMore ? (
                    <div className="load-more-tip">上拉加载更多</div>
                  ) : (
                    <div className="no-more-tip">
                      <span>已加载全部内容</span>
                    </div>
                  )}
                </InfiniteScroll>
              </>
            )}
          </div>
        </PullToRefresh>
      </div>

      {/* 发起拼车按钮 */}
      <div className="footer">
        <Button
          block
          color="primary"
          size="large"
          loading={loading}
          onClick={handleInitiate}
          disabled={!selectedScript}
        >
          {loading ? '发起中...' : '发起拼车'}
        </Button>
      </div>
    </div>
  );
};

export default InitiateCarpoolingZ;