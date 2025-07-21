import { NavBar } from "antd-mobile";
import { MoreOutline, LocationOutline } from 'antd-mobile-icons'

const Home = () => {
  const left = (
    <div style={{ display: 'flex', alignItems: 'center',fontSize: 24 }}>
      <LocationOutline style={{ marginRight: '8px' }} />
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
        <NavBar back={null} style={{height: 44}} left={left} right={right}></NavBar>
      </div>
    </>
  );
};

export default Home;
