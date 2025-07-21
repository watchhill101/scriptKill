import { NavBar, Swiper } from "antd-mobile";
import { MoreOutline, LocationOutline } from "antd-mobile-icons";
import img1 from "../../assets/images/1.jpeg";
import img2 from "../../assets/images/2.jpeg";

const Home = () => {
  const imgList = [img1, img2];
  const items = imgList.map((item) => (
    <Swiper.Item>
      <div key={item} style={{ height: "100%", width: "100%" }}>
        <img src={item} alt="" style={{ height: "100%", width: "100%" }} />
      </div>
    </Swiper.Item>
  ));
  const left = (
    <div style={{ display: "flex", alignItems: "center", fontSize: 24 }}>
      <LocationOutline style={{ marginRight: "8px" }} />
      <span>Yar沉浸式剧本杀</span>
    </div>
  );

  const right = (
    <div style={{ fontSize: 24 }}>
      <MoreOutline />
    </div>
  );

  return (
    <>
      <div>
        <NavBar
          back={null}
          style={{ height: 44 }}
          left={left}
          right={right}
        ></NavBar>
      </div>
      <div>
        <Swiper
          loop
          autoplay
          onIndexChange={(i) => {
            console.log(i, "onIndexChange1");
          }}
        >
          {items}
        </Swiper>
      </div>
      <div>个人信息</div>
      <div></div>
    </>
  );
};

export default Home;
