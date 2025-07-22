import React, { useState, useEffect, useRef } from "react";
import { NavBar, Input, Tabs, Swiper, Button, Popup } from "antd-mobile";
import { MoreOutline, SearchOutline, FilterOutline } from "antd-mobile-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./script.css";

const Script = () => {
  const navigate = useNavigate();
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scriptList, setScriptList] = useState([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    playerCount: [],
    difficulty: [],
    tags: [],
  });
  const right = (
    <div className="nav-right-icon">
      <MoreOutline />
    </div>
  );
  const left = (
    <div className="nav-left-search">
      <SearchOutline className="search-icon" />
      <Input placeholder="输入剧本名/DM名" clearable />
    </div>
  );
  const tabItems = [
    {
      title: `综合`,
      key: "1",
    },
    {
      title: `热门`,
      key: "2",
    },
    {
      title: `新剧`,
      key: "3",
    },
  ];
  // 筛选选项数据
  const filterOptions = {
    playerCount: ["5人", "6人", "7人", "8人", "9人", "10人", "11人", "12+"],
    difficulty: ["入门", "进阶", "适中", "困难", "骨灰"],
    tags: [
      "恋爱",
      "还原",
      "欢乐",
      "作者",
      "古风",
      "异兽",
      "预定",
      "推理",
      "恐怖",
    ],
  };

  // 处理筛选选项点击
  const handleFilterSelect = (category, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      const currentValues = newFilters[category];

      if (currentValues.includes(value)) {
        newFilters[category] = currentValues.filter((item) => item !== value);
      } else {
        newFilters[category] = [...currentValues, value];
      }

      return newFilters;
    });
  };

  // 重置筛选
  const resetFilters = () => {
    const emptyFilters = {
      playerCount: [],
      difficulty: [],
      tags: [],
    };
    setFilters(emptyFilters);
    // 重置后立即获取全部剧本
    getScriptList();
  };

  // 确定筛选
  const confirmFilters = () => {
    setFilterVisible(false);
    // 使用当前筛选条件获取剧本
    getScriptList(filters);
    console.log("当前筛选条件:", filters);
  };

  //获取剧本
  const getScriptList = async (filterParams = {}) => {
    try {
      // 构建查询参数
      const params = new URLSearchParams();

      // 添加筛选参数
      if (filterParams.playerCount && filterParams.playerCount.length > 0) {
        filterParams.playerCount.forEach((count) => {
          params.append("playerCount", count);
        });
      }

      if (filterParams.difficulty && filterParams.difficulty.length > 0) {
        filterParams.difficulty.forEach((diff) => {
          params.append("difficulty", diff);
        });
      }

      if (filterParams.tags && filterParams.tags.length > 0) {
        filterParams.tags.forEach((tag) => {
          params.append("tags", tag);
        });
      }

      const queryString = params.toString();
      const url = queryString
        ? `http://localhost:3000/script?${queryString}`
        : "http://localhost:3000/script";

      const res = await axios.get(url);
      setScriptList([...res.data.data]);
    } catch (error) {
      console.error("获取剧本失败:", error);
    }
  };

  useEffect(() => {
    getScriptList();
  }, []);
  console.log(scriptList);

  return (
    <>
      <div className="sticky-header">
        <div>
          <NavBar right={right} left={left}></NavBar>
        </div>
        <div className="tabs-filter-container">
          <Tabs
            activeKey={tabItems[activeIndex].key}
            onChange={(key) => {
              const index = tabItems.findIndex((item) => item.key === key);
              setActiveIndex(index);
              swiperRef.current?.swipeTo(index);
            }}
            className="tabs-wrapper"
          >
            {tabItems.map((item) => (
              <Tabs.Tab title={item.title} key={item.key} />
            ))}
          </Tabs>
          {/* 筛选按钮 */}
          <Button
            size="small"
            fill="outline"
            onClick={() => setFilterVisible(true)}
            className="filter-button"
          >
            <FilterOutline className="filter-icon" />
            筛选
          </Button>
          {/* 筛选弹窗 */}
          <Popup
            visible={filterVisible}
            onMaskClick={() => setFilterVisible(false)}
            position="top"
            bodyClassName="filter-popup"
          >
            <div className="filter-content">
              <h3 className="filter-title">筛选条件</h3>

              {/* 人数筛选 */}
              <div className="filter-category">
                <h4 className="filter-category-title">人数</h4>
                <div className="filter-options">
                  {filterOptions.playerCount.map((count) => (
                    <Button
                      key={count}
                      size="small"
                      fill={
                        filters.playerCount.includes(count)
                          ? "solid"
                          : "outline"
                      }
                      color={
                        filters.playerCount.includes(count)
                          ? "primary"
                          : "default"
                      }
                      onClick={() => handleFilterSelect("playerCount", count)}
                      className="filter-option-button"
                    >
                      {count}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 难度筛选 */}
              <div className="filter-category">
                <h4 className="filter-category-title">难度</h4>
                <div className="filter-options">
                  {filterOptions.difficulty.map((level) => (
                    <Button
                      key={level}
                      size="small"
                      fill={
                        filters.difficulty.includes(level) ? "solid" : "outline"
                      }
                      color={
                        filters.difficulty.includes(level)
                          ? "primary"
                          : "default"
                      }
                      onClick={() => handleFilterSelect("difficulty", level)}
                      className="filter-option-button"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 标签筛选 */}
              <div className="filter-category">
                <h4 className="filter-category-title">标签</h4>
                <div className="filter-options">
                  {filterOptions.tags.map((tag) => (
                    <Button
                      key={tag}
                      size="small"
                      fill={filters.tags.includes(tag) ? "solid" : "outline"}
                      color={filters.tags.includes(tag) ? "primary" : "default"}
                      onClick={() => handleFilterSelect("tags", tag)}
                      className="filter-option-button"
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 底部按钮 */}
              <div className="filter-bottom-buttons">
                <Button
                  block
                  fill="outline"
                  onClick={resetFilters}
                  className="reset-button"
                >
                  重置
                </Button>
                <Button
                  block
                  color="primary"
                  onClick={confirmFilters}
                  className="confirm-button"
                >
                  确定
                </Button>
              </div>
            </div>
          </Popup>
        </div>
      </div>
      <div>
        <Swiper
          direction="horizontal"
          loop
          indicator={() => null}
          ref={swiperRef}
          defaultIndex={activeIndex}
          onIndexChange={(index) => {
            setActiveIndex(index);
          }}
        >
          {tabItems.map((tab) => (
            <Swiper.Item key={tab.key}>
              <div className="swiper-content">
                {scriptList.map((script) => (
                  <div
                    key={script._id}
                    onClick={() => {
                      // Log the script data before navigation
                      console.log("Navigating with script data:", script);

                      // Store script data in localStorage for retrieval
                      localStorage.setItem(`script_${script._id}`, JSON.stringify(script));
                      
                      // Navigate with script ID in URL
                      navigate(`/ZYC/scriptdetails/${script._id}`);
                    }}
                  >
                    <div className="script-card">
                      {/* 剧本封面图片 */}
                      <div className="script-cover-container">
                        <img
                          src={script.imgUrl || "/placeholder-script.jpg"}
                          alt={script.name}
                          className="script-cover-image"
                        />
                      </div>

                      {/* 剧本信息 */}
                      <div className="script-info">
                        {/* 剧本名称 */}
                        <h3 className="script-name">{script.name}</h3>

                        {/* 类型标签 */}
                        <div className="script-tags-container">
                          {script.type &&
                            script.type.map((typeItem, index) => (
                              <span key={index} className="script-tag">
                                {typeItem.name}
                              </span>
                            ))}
                        </div>

                        {/* 游戏信息 */}
                        <div className="script-game-info">
                          <span className="script-info-item">
                            👥 {script.recommendNum?.boyNum || 0}男
                            {script.recommendNum?.grilNum || 0}女
                          </span>
                          <span className="script-info-item">
                            ⏰ {script.duration || "未知时长"}
                          </span>
                          <span>🎯 进阶</span>
                        </div>

                        {/* 价格 */}
                        <div className="script-price">
                          $ {script.price || 0} /人起
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Swiper.Item>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default Script;
