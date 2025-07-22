import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import CouponList from './pages/you_X/CouponList';
import WantPlay from './pages/you_X/WantPlay';
import Played from './pages/you_X/Played';
import FundDetailDebit from './pages/you_X/FundDetailDebit';
import FundDetailRecharge from './pages/you_X/FundDetailRecharge';
import ScriptTimeline from './pages/you_X/ScriptTimeline';
import ScriptTimelineDetail from './pages/you_X/ScriptTimelineDetail';


function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/coupon-list" element={<CouponList />} />
          <Route path="/want-play" element={<WantPlay />} />
          <Route path="/played" element={<Played />} />
          <Route path="/debit" element={<FundDetailDebit />} />
          <Route path="/recharge" element={<FundDetailRecharge />} />
          <Route path="/timeline" element={<ScriptTimeline />} />
          <Route path="/timeline/:id" element={<ScriptTimelineDetail />} />

          <Route path="*" element={<Navigate to="/coupon-list" replace />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App

