import React, { useState, useEffect, useRef } from "react";
import { NavBar, Input, Tabs, Swiper } from "antd-mobile";
import { MoreOutline, SearchOutline } from "antd-mobile-icons";
import axios from "axios";

const Script = () => {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scriptList, setScriptList] = useState([]);
  const right = (
    <div style={{ fontSize: 24 }}>
      <MoreOutline />
    </div>
  );
  const left = (
    <div
      style={{
        fontSize: 16,
        display: "flex",
        width: "150%",
        justifyContent: "center",
        alignContent: "center",
        backgroundColor: "#f5f5f5",
        borderRadius: 10,
      }}
    >
      <SearchOutline style={{ marginRight: 10, fontSize: 20 }} />
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
  useEffect(() => {
    axios.get("http://localhost:3000/script").then((res) => {
      setScriptList([...res.data.data]);
    });
  }, []);
  
  return (
    <>
      <div>
        <NavBar right={right} left={left}></NavBar>
      </div>
      <div>
        <Tabs
          activeKey={tabItems[activeIndex].key}
          onChange={(key) => {
            const index = tabItems.findIndex((item) => item.key === key);
            setActiveIndex(index);
            swiperRef.current?.swipeTo(index);
          }}
        >
          {tabItems.map((item) => (
            <Tabs.Tab title={item.title} key={item.key} />
          ))}
          
        </Tabs>
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
          <Swiper.Item>
            <div>菠萝</div>
          </Swiper.Item>
          <Swiper.Item>
            <div>西红柿</div>
          </Swiper.Item>
          <Swiper.Item>
            <div>蚂蚁</div>
          </Swiper.Item>
        </Swiper>
      </div>
    </>
  );
};

export default Script;
