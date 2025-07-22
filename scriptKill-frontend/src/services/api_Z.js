import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/index_Z',
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
  getDetail: (id) => api.get(`/scripts/${id}`)
};

export const shopAPI = {
  getDetail: (id) => api.get(`/shops/${id}`)
};

export const carGroupAPI = {
  // 获取发车列表
  getList: (params) => api.get('/car-groups', { params }),
  // 加入发车
  join: (id, data) => api.post(`/car-groups/${id}/join`, data)
};

// 添加发起拼车相关的 API
export const initiateCarAPI = {
  // 创建发车信息
  create: (data) => api.post('/initiate-car', data)
};