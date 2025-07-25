import { useLocation, useNavigate, Outlet, useParams } from "react-router-dom";
import {
  LeftOutline,
  MoreOutline,
  QuestionCircleOutline,
  HeartOutline,
  AddOutline,
  SendOutline,
} from "antd-mobile-icons";
import { Button, Popup } from "antd-mobile";
import { Tabs } from "antd-mobile";
import React, { useEffect, useState } from "react";
import "./script.css";

// 简单的星级评分组件
const StarRating = ({ value, count = 5 }) => {
  const stars = [];
  for (let i = 1; i <= count; i++) {
    stars.push(
      <span key={i} className={`star ${i <= value ? "filled" : "empty"}`}>
        ★
      </span>
    );
  }
  return <div className="star-rating">{stars}</div>;
};

const Scriptdetails = () => {
  const [visible7, setVisible7] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { scriptId } = useParams();
  const [activeTab, setActiveTab] = useState("/comment");
  const [script, setScript] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(0); // 0表示当前周，正数表示未来几周，负数表示过去几周
  const [selectedDay, setSelectedDay] = useState(0); // 0-6表示周一到周日

  // Get script data from localStorage using the scriptId from URL params
  useEffect(() => {
    if (scriptId) {
      try {
        const storedScript = localStorage.getItem(`script_${scriptId}`);
        if (storedScript) {
          const parsedScript = JSON.parse(storedScript);
          setScript(parsedScript);
          console.log("Retrieved script data:", parsedScript);
        } else {
          console.log("No script data found for ID:", scriptId);
        }
      } catch (error) {
        console.error("Error parsing script data:", error);
      }
    }
  }, [scriptId]);

  // 处理从localStorage获取的数据，如果没有则使用默认数据
  const scriptData = script
    ? {
        name: script.name || "云画和光",
        cover: script.imgUrl || "/api/placeholder/300/400",
        playerCount: `${
          (script.recommendNum?.boyNum || 0) +
          (script.recommendNum?.grilNum || 0)
        }人`,
        tags: script.type
          ? script.type.map((t) => t.name)
          : ["古风", "还原", "情感"],
        difficulty: `${script.recommendNum?.boyNum || 4}男${
          script.recommendNum?.grilNum || 4
        }女`,
        duration: script.duration || "5-6小时",
        type: "进阶",
        rating: 8.0,
        totalRatings: "173.17万评",
        price: script.price || 0,
        ratingStats: {
          5: 78,
          4: 105,
          3: 45,
          2: 12,
          1: 3,
        },
        description:
          script.description ||
          "那时，我们在西蜀相遇。见过雄大的日出，行过壮阔雪峰，穿过险峻的雪山。一路来颠沛流离，无数次梦死重生，终于证明存在的意义是信任和爱。夏余的是...",
        characters: [
          { name: "金森", avatar: "/api/placeholder/100/120" },
          { name: "苏悦", avatar: "/api/placeholder/100/120" },
          { name: "陈白羊", avatar: "/api/placeholder/100/120" },
          { name: "马芃", avatar: "/api/placeholder/100/120" },
        ],
      }
    : {
        name: "云画和光",
        cover: "/api/placeholder/300/400",
        playerCount: "8人",
        tags: ["古风", "还原", "情感"],
        difficulty: "4男4女",
        duration: "5-6小时",
        type: "进阶",
        rating: 8.0,
        totalRatings: "173.17万评",
        price: 0,
        ratingStats: {
          5: 78,
          4: 105,
          3: 45,
          2: 12,
          1: 3,
        },
        description:
          "那时，我们在西蜀相遇。见过雄大的日出，行过壮阔雪峰，穿过险峻的雪山。一路来颠沛流离，无数次梦死重生，终于证明存在的意义是信任和爱。夏余的是...",
        characters: [
          { name: "金森", avatar: "/api/placeholder/100/120" },
          { name: "苏悦", avatar: "/api/placeholder/100/120" },
          { name: "陈白羊", avatar: "/api/placeholder/100/120" },
          { name: "马芃", avatar: "/api/placeholder/100/120" },
        ],
      };

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    // Check the current path and set the active tab accordingly
    const path = location.pathname;
    if (path.includes("comment")) {
      setActiveTab("/comment");
    } else if (path.includes("describe")) {
      setActiveTab("/describe");
    } else {
      // Default to comment tab if no specific path
      navigate("comment", { replace: true });
    }
  }, [location.pathname, navigate]);

  // 获取指定周的日期（周一到周六）
  const getWeekDates = (weekOffset = 0) => {
    const now = new Date();
    const currentDay = now.getDay(); // 0是周日，1是周一，...，6是周六
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // 计算到本周一的偏移量

    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset + weekOffset * 7); // 设置为指定周的周一

    const weekDates = [];
    for (let i = 0; i < 6; i++) {
      // 只获取周一到周六
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDates.push({
        dayName: ["周一", "周二", "周三", "周四", "周五", "周六"][i],
        date: date,
        formattedDate: `${date.getMonth() + 1}-${date.getDate()}`,
      });
    }

    return weekDates;
  };

  // 切换到上一周
  const goToPreviousWeek = () => {
    setCurrentWeek((prev) => prev - 1);
    setSelectedDay(0); // 重置选中的日期为周一
  };

  // 切换到下一周
  const goToNextWeek = () => {
    setCurrentWeek((prev) => prev + 1);
    setSelectedDay(0); // 重置选中的日期为周一
  };

  return (
    <div className="script-details-container">
      {/* 顶部导航栏 */}
      <div className="details-header">
        <LeftOutline className="back-icon" onClick={handleBack} />
        <h2 className="details-title">{scriptData.name}</h2>
        <div className="header-actions">
          <MoreOutline className="action-icon" />
          <QuestionCircleOutline className="action-icon" />
        </div>
      </div>

      {/* 剧本基本信息 */}
      <div className="script-basic-info">
        <div className="script-cover-section">
          <img
            src={scriptData.cover}
            alt={scriptData.name}
            className="details-cover-image"
          />
        </div>

        <div className="script-meta-info">
          <h1 className="script-title">{scriptData.name}</h1>

          <div className="script-tags-row">
            <span className="player-count-tag">{scriptData.playerCount}</span>
            {scriptData.tags.map((tag, index) => (
              <span key={index} className="script-detail-tag">
                {tag}
              </span>
            ))}
          </div>

          <div className="script-specs">
            <div className="spec-item">
              <span className="spec-icon">👥</span>
              <span>{scriptData.difficulty}</span>
            </div>
            <div className="spec-item">
              <span className="spec-icon">⏰</span>
              <span>{scriptData.duration}</span>
            </div>
            <div className="spec-item">
              <span className="spec-icon">🎯</span>
              <span>{scriptData.type}</span>
            </div>
          </div>

          <div className="action-buttons">
            <Button className="like-button">
              <HeartOutline /> 想玩
            </Button>
            <Button className="add-button">
              <AddOutline /> 玩过
            </Button>
          </div>
        </div>
      </div>

      {/* 评分区域 */}
      <div className="rating-section">
        <div className="rating-overview">
          <div className="rating-score">
            <span className="score-number">{scriptData.rating}</span>
            <div className="rating-stars">
              <StarRating value={4} />
            </div>
            <span className="rating-count">{scriptData.totalRatings}</span>
          </div>

          <div className="rating-distribution">
            <div className="rating-stats">
              <span className="played-count">
                {scriptData.ratingStats[5]}人想玩
              </span>
              <span className="finished-count">
                {scriptData.ratingStats[4]}人玩过
              </span>
            </div>
            <div className="rating-bars">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="rating-bar-row">
                  <div className="rating-stars-small">
                    <StarRating value={star} count={5} />
                  </div>
                  <div className="rating-bar">
                    <div
                      className="rating-bar-fill"
                      style={{
                        width: `${(scriptData.ratingStats[star] / 105) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 剧本简介 */}
      <div className="script-description-section">
        <h3 className="section-title">剧本简介</h3>
        <p className="description-text">
          {scriptData.description}
          <span className="expand-text">展开</span>
        </p>
      </div>

      {/* 角色介绍 */}
      <div className="characters-section">
        <h3 className="section-title">角色介绍</h3>
        <div className="characters-grid">
          {scriptData.characters.map((character, index) => (
            <div key={index} className="character-card">
              <img
                src={`/public/2.jpeg`}
                alt={character.name}
                className="character-avatar"
              />
              <span className="character-name">{character.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 底部标签页 */}
      <div className="bottom-tabs">
        {/* <div className="tab-item active">评价</div>
                <div className="tab-item">describe</div> */}
        <Tabs
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key);
            // Extract the tab name without the leading slash
            const tabPath = key.substring(1);
            navigate(tabPath);
          }}
          style={{
            textAlign: "center",
            "--title-font-size": "16px",
            "--active-line-height": "2px",
            "--active-title-color": "#ff5e00",
          }}
        >
          <Tabs.Tab title="评价" key="/comment" />
          <Tabs.Tab title="描述" key="/describe" />
        </Tabs>
      </div>

      {/* 浮动评价按钮 */}
      <div className="floating-review-button">写评价</div>

      <div className="tab-content-area">
        <Outlet />
        <Popup
          visible={visible7}
          showCloseButton
          closeOnMaskClick
          onClose={() => {
            setVisible7(false);
          }}
          bodyStyle={{
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
            paddingTop:'40px',
            minHeight: "400px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="booking-popup">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <div
                onClick={goToPreviousWeek}
                style={{
                  padding: "5px 10px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                ←
              </div>
              <h2
                style={{
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "bold",
                  margin: 0,
                }}
              >
                请选择预约场次
              </h2>
              <div
                onClick={goToNextWeek}
                style={{
                  padding: "5px 10px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                →
              </div>
            </div>

            <div
              className="date-selection"
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "40px",
              }}
            >
              {getWeekDates(currentWeek).map((day, index) => (
                <div
                  key={index}
                  className="date-option"
                  onClick={() => setSelectedDay(index)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                    padding: "5px",
                    minWidth: "40px",
                  }}
                >
                  <div
                    style={{
                      fontWeight: selectedDay === index ? "bold" : "normal",
                      marginBottom: "5px",
                      color: selectedDay === index ? "#333" : "#666",
                      fontSize:'15px',
                    }}
                  >
                    {day.dayName}
                  </div>
                  <div
                    style={{
                      color: selectedDay === index ? "#333" : "#666",
                      fontSize: "14px",
                    }}
                  >
                    {day.formattedDate}
                  </div>
                  {selectedDay === index && (
                    <div
                      style={{
                        width: "100%",
                        height: "3px",
                        backgroundColor: "#1890ff",
                        marginTop: "5px",
                        borderRadius: "2px",
                      }}
                    ></div>
                  )}
                </div>
              ))}
            </div>

            <Button
              block
              color="primary"
              style={{
                borderRadius: "50px",
                height: "50px",
                fontSize: "18px",
                fontWeight: "normal",
                marginTop: "auto",
              }}
              onClick={() => {
                // 获取用户选择的日期
                const selectedDate = getWeekDates(currentWeek)[selectedDay].date;
                
                // 导航到预约支付页面并传递数据
                navigate('/appointment-payment', {
                  state: {
                    scriptId: scriptId,
                    selectedDate: selectedDate,
                    selectedDay: selectedDay,
                    weekDay: getWeekDates(currentWeek)[selectedDay].dayName,
                    formattedDate: getWeekDates(currentWeek)[selectedDay].formattedDate,
                    // 其他可能需要的数据
                  }
                });
                
                // 关闭当前弹窗
                setVisible7(false);
              }}
            >
              下一步
            </Button>
          </div>
        </Popup>
      </div>
      <div className="fixed-Bottom">
        <div style={{ width: "80%", margin: "0 auto" }}>
          <Button
            block
            shape="rounded"
            color="primary"
            onClick={() => {
              setVisible7(true);
            }}
          >
            选择场次并预约
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Scriptdetails;
