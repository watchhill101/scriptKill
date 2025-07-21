import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import FundDetailDebit from './pages/you_X/FundDetailDebit'
import FundDetailRecharge from './pages/you_X/FundDetailRecharge'
import CouponList from './pages/you_X/CouponList';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/coupon-list" element={<CouponList />} />
          <Route path="/debit" element={<FundDetailDebit />} />
          <Route path="/recharge" element={<FundDetailRecharge />} />
          <Route path="*" element={<Navigate to="/coupon-list" replace />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App
