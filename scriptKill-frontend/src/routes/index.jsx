import { createBrowserRouter, Navigate } from "react-router-dom";

// 首页组件
import Home from "../pages/homePage/home";

// G组 - 剧本相关页面
import Script from "../pages/scriptPage/script";
import Scriptdetails from "../pages/scriptPage/scriptdetails";
import Comment from "../pages/scriptPage/comment";
import Describe from "../pages/scriptPage/describe";

// J组 - 排行榜和个人中心相关页面
import RankingPage from "../pages/RanKingPage_J";
import ProfilePage from "../pages/ProfilePage_J";
import CouponList from "../pages/you_X/CouponList";
import Chong from "../pages/Chong_J";
import WantPlay from "../pages/you_X/WantPlay";
import Played from "../pages/you_X/Played";
import FundDetailDebit from "../pages/you_X/FundDetailDebit";
import FundDetailRecharge from "../pages/you_X/FundDetailRecharge";
import ScriptTimeline from "../pages/you_X/ScriptTimeline";
import ScriptTimelineDetail from "../pages/you_X/ScriptTimelineDetail";

// Z组 - 预约和拼车相关页面
import AppointmentPaymentZ from "../pages/Appointment_payment_Z/Appointment_payment_Z";
import StartCarZ from "../pages/StartCar_Z/StartCar_Z";
import CarpoolDetailsZ from "../pages/Carpool_details_Z/Carpool_details_Z";
import CarpoolPaymentZ from "../pages/Carpool_payment_Z/Carpool_payment_Z";
import InitiateCarpoolingZ from "../pages/Initiate_carpooling_Z/Initiate_carpooling_Z";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  // G组路由 - 剧本相关
  {
    path: "/script",
    element: <Script />,
  },
  {
    path: "/scriptdetails/:scriptId",
    element: <Scriptdetails />,
    children: [
      {
        path: "comment",
        element: <Comment />,
      },
      {
        path: "describe",
        element: <Describe />,
      },
      {
        path: "",
        element: <Navigate to="comment" replace />,
      },
    ],
  },
  // J组路由 - 排行榜和个人中心
  {
    path: "/ranking",
    element: <RankingPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/coupon-list",
    element: <CouponList />,
  },
  {
    path: "/chong",
    element: <Chong />,
  },
  {
    path: "/want-play",
    element: <WantPlay />,
  },
  {
    path: "/played",
    element: <Played />,
  },
  {
    path: "/debit",
    element: <FundDetailDebit />,
  },
  {
    path: "/recharge",
    element: <FundDetailRecharge />,
  },
  {
    path: "/timeline",
    element: <ScriptTimeline />,
  },
  {
    path: "/timeline/:id",
    element: <ScriptTimelineDetail />,
  },
  // Z组路由 - 预约和拼车
  {
    path: "/appointment-payment",
    element: <AppointmentPaymentZ />,
  },
  {
    path: "/start-car",
    element: <StartCarZ />,
  },
  {
    path: "/carpool-details",
    element: <CarpoolDetailsZ />,
  },
  {
    path: "/carpool-payment",
    element: <CarpoolPaymentZ />,
  },
  {
    path: "/initiate-carpooling",
    element: <InitiateCarpoolingZ />,
  },
  // 兼容旧路由结构
  {
    path: "/ZYC",
    children: [
      {
        path: "script",
        element: <Script />,
      },
      {
        path: "scriptdetails/:scriptId",
        element: <Scriptdetails />,
        children: [
          {
            path: "comment",
            element: <Comment />,
          },
          {
            path: "describe",
            element: <Describe />,
          },
          {
            path: "",
            element: <Navigate to="comment" replace />,
          },
        ],
      },
      {
        path: "Appointment_payment_Z",
        element: <AppointmentPaymentZ />,
      },
      {
        path: "StartCar_Z",
        element: <StartCarZ />,
      },
      {
        path: "Carpool_details_Z",
        element: <CarpoolDetailsZ />,
      },
      {
        path: "Carpool_payment_Z",
        element: <CarpoolPaymentZ />,
      },
      {
        path: "LnitiateCarpooling_Z",
        element: <InitiateCarpoolingZ />,
      },
    ],
  },
  // 404 重定向到首页
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default routes;