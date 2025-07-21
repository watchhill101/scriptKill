import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RankingPage from './pages/RankingPage';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        {/* 默认路由重定向到排行榜页面 */}
        <Route path="/" element={<Navigate to="/ranking" replace />} />
        {/* 排行榜页面路由 */}
        <Route path="/ranking" element={<RankingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
