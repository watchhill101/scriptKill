import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/z',
  timeout: 10000
});

export const appointmentAPI = {
  create: (data) => api.post('/appointments', data),
  getDetail: (id) => api.get(`/appointments/${id}`),
};

export const couponAPI = {
  // 获取可用优惠券列表
  getAvailable: (params) => api.get('/coupons', { params })
};

export const scriptAPI = {
  getDetail: (id) => api.get(`/scripts/${id}`),
  getList: (params) => api.get('/scripts', { params }) // 新增
};

export const shopAPI = {
  getDetail: (id) => api.get(`/shops/${id}`)
};

export const carGroupAPI = {
  // 获取发车列表
  getList: (params) => api.get('/car-groups', { params }),
  // 加入发车
  join: (id, data) => api.post(`/car-groups/${id}/join`, data),
  // 获取发车详情
  getDetail: (id) => api.get(`/car-groups/${id}`),
  // 拼车支付
  payment: (data) => api.post('/carpool-payment', data)
};

// 添加发起拼车相关的 API
export const initiateCarAPI = {
  // 创建发车信息
  create: (data) => api.post('/initiate-car', data),
  getList: (params) => api.get('/initiate-cars', { params }),
  // 获取发起拼车详情 (新增)
  getDetail: (id) => api.get(`/initiate-cars/${id}`)
};