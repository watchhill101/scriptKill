import React, { useState, useEffect } from 'react';
import { SearchBar, Toast, Tabs, DotLoading, PullToRefresh, InfiniteScroll, SpinLoading } from 'antd-mobile';
import { FilterOutline } from 'antd-mobile-icons';
import './StartCar_Z.scss';
import { carGroupAPI } from '../../services/api_Z';
import { useDebounce } from '../../hooks/useDebounce_Z';
import { useNavigate } from 'react-router-dom';
import FloatingBall_Z from '../../components/FloatingBall_Z/FloatingBall_Z';

const TAB_LIST = [
  { 
    key: 'latest', 
    title: '最近开车',
    description: '按发车时间排序'
  },
  { 
    key: 'fastest', 
    title: '最快拼满',
    description: '按填充率排序'
  },
  { 
    key: 'hot', 
    title: '热度最高',
    description: '按热度排序'
  }
];

const StartCarZ = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('latest');
  const [carGroups, setCarGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  // 修改获取发车列表的方法
  const fetchCarGroups = async (tab = activeTab, isRefresh = true) => {
    try {
      setLoading(true);
      const res = await carGroupAPI.getList({ 
        sort: tab,
        page: isRefresh ? 1 : page,
        pageSize: PAGE_SIZE 
      });
      
      if (res.data.code === 0) {
        const newList = res.data.data || [];
        if (isRefresh) {
          setCarGroups(newList);
          setPage(1);
        } else {
          setCarGroups(prev => [...prev, ...newList]);
        }
        setHasMore(newList.length === PAGE_SIZE);
      } else {
        Toast.show({
          icon: 'fail',
          content: res.data.msg || '获取发车列表失败'
        });
      }
    } catch (err) {
      Toast.show({
        icon: 'fail',
        content: '获取发车列表失败'
      });
      console.error('获取发车列表失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 上拉加载更多
  const loadMore = async () => {
    if (!hasMore || loading) return;
    setPage(p => p + 1);
    await fetchCarGroups(activeTab, false);
  };

  // 下拉刷新
  const onRefresh = async () => {
    await fetchCarGroups(activeTab, true);
  };

  // tab 切换处理
  const handleTabChange = (key) => {
    setActiveTab(key);
    Toast.show({
      icon: 'loading',
      content: '加载中...',
      duration: 0
    });
    fetchCarGroups(key).finally(() => {
      Toast.clear();
    });
  };

  // 初始加载数据
  useEffect(() => {
    fetchCarGroups('latest');
  }, []);

  // 跳转到拼车详情页
  const goToDetail = (carGroup) => {
    navigate(`/ZYC/Carpool_payment_Z`, {
      state: { carGroupId: carGroup._id }
    });
  };

  // 加入发车并跳转
  const handleJoin = async (e, carGroup) => {
    // 阻止事件冒泡，避免触发卡片点击事件
    e.stopPropagation();
    
    try {
      const userId = '64e1b2c1f1a2b3c4d5e6f7a8';
      const res = await carGroupAPI.join(carGroup._id, {
        userId,
        gender: 'male'
      });

      if (res.data.code === 0) {
        Toast.show({
          icon: 'success',
          content: '加入成功'
        });
        // 加入成功后跳转到详情页
        goToDetail(carGroup);
      } else {
        Toast.show({
          icon: 'fail',
          content: res.data.msg || '加入失败'
        });
      }
    } catch (err) {
      Toast.show({
        icon: 'fail',
        content: err.response?.data?.msg || '加入失败'
      });
    }
  };

  // 使用防抖处理搜索
  const debouncedSearch = useDebounce(async (value) => {
    try {
      setLoading(true);
      const res = await carGroupAPI.getList({ 
        sort: activeTab,
        search: value 
      });
      
      if (res.data.code === 0) {
        setCarGroups(res.data.data);
      }
    } catch (err) {
      Toast.show({
        icon: 'fail',
        content: '搜索失败'
      });
    } finally {
      setLoading(false);
    }
  }, 500);

  // 搜索框值变化处理
  const handleSearchChange = (value) => {
    setSearchValue(value);
    debouncedSearch(value);
  };

  // 搜索框取消按钮点击处理
  const handleSearchCancel = () => {
    setSearchValue('');
    fetchCarGroups(activeTab);
  };

  // 修改渲染列表项方法
  const renderCarItem = (carGroup) => {
    const { script, currentPeople, maxPeople } = carGroup;
    const remainingPeople = maxPeople - currentPeople.length;

    return (
      <div 
        key={carGroup._id} 
        className="car-item"
        onClick={() => goToDetail(carGroup)}
      >
        <div className="script-info">
          <img className="cover" src={script.image} alt={script.name} />
          <div className="details">
            <div className="title">
              <span>{script.name}</span>
              <span className="score">{script.score || '8.0'}分</span>
            </div>
            <div className="tags">
              {[
                `${maxPeople}人`,
                ...script.tags
              ].map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
            <div className="basic-info">
              <span>{`${carGroup.requirements.male}男${carGroup.requirements.female}女`}</span>
              <span className="divider">|</span>
              <span>{`${script.duration}分钟`}</span>
              <span className="divider">|</span>
              <span>进阶</span>
            </div>
            <div className="price">
              ¥{script.price}<span className="unit">/人起</span>
            </div>
          </div>
        </div>

        <div className="time-info">
          {`${new Date(carGroup.date).toLocaleDateString()} ${carGroup.timeSlot.start}~${carGroup.timeSlot.end}`}
        </div>

        <div className="people-info">
          <div className="avatars">
            {currentPeople.map((person, index) => (
              <img
                key={person.user._id}
                className="avatar"
                src={person.user.avatar || 'https://via.placeholder.com/40'}
                alt=""
              />
            ))}
          </div>
          <div className="status">
            已加入{currentPeople.length}人，还差{remainingPeople}人
          </div>
          <button 
            className="join-btn"
            onClick={(e) => handleJoin(e, carGroup)}
            disabled={carGroup.status === 'full'}
          >
            {carGroup.status === 'full' ? '已满员' : '加入拼车'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="start-car">
      <div className="header">
        <SearchBar
          className="search"
          placeholder="输入剧本名/DM"
          value={searchValue}
          onChange={handleSearchChange}
          onCancel={handleSearchCancel}
          showCancelButton
        />
        <FilterOutline className="filter-btn" />
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        className="custom-tabs"
      >
        {TAB_LIST.map(tab => (
          <Tabs.Tab title={tab.title} key={tab.key} description={tab.description}>
            <PullToRefresh
              onRefresh={onRefresh}
              renderText={(status) => {
                return (
                  <div className="pull-to-refresh-content">
                    {status === 'pulling' && (
                      <>
                        <SpinLoading color="primary" />
                        <span>下拉刷新</span>
                      </>
                    )}
                    {status === 'canRelease' && (
                      <>
                        <SpinLoading color="primary" />
                        <span>释放刷新</span>
                      </>
                    )}
                    {status === 'refreshing' && (
                      <>
                        <DotLoading color="primary" />
                        <span>刷新中...</span>
                      </>
                    )}
                    {status === 'complete' && (
                      <span>刷新成功</span>
                    )}
                  </div>
                )
              }}
            >
              <div className="car-list">
                {carGroups.map(carGroup => renderCarItem(carGroup))}
                
                <InfiniteScroll
                  loadMore={loadMore}
                  hasMore={hasMore}
                  threshold={250}
                >
                  {loading ? (
                    <div className="loading">
                      <DotLoading color="primary" />
                      <span>拼命加载中...</span>
                    </div>
                  ) : !hasMore && carGroups.length > 0 ? (
                    <div className="no-more">
                      <span>我是有底线的🥺 ~</span>
                    </div>
                  ) : null}
                </InfiniteScroll>

                {!loading && carGroups.length === 0 && (
                  <div className="empty">暂无发车信息</div>
                )}
              </div>
            </PullToRefresh>
          </Tabs.Tab>
        ))}
      </Tabs>

      <FloatingBall_Z />
    </div>
  );
};

export default StartCarZ;