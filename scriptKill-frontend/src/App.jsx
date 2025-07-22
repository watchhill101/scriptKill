import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './routes/routers_S'; // 导入路由配置

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;