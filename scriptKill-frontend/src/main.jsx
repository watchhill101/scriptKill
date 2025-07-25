import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// 首先导入全局样式
import "./styles/index.css"; 
// 然后导入其他组件
import App from "./App.jsx";
import 'autoprefixer'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
