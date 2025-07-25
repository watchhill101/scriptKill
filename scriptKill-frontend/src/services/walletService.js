import axios from 'axios';

const API_URL = 'http://localhost:3000';

// 获取用户钱包信息
export const getUserWallet = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/wallet/${userId}`);
    return response.data;
  } catch (error) {
    console.error('获取钱包信息失败', error);
    throw error;
  }
};

// 充值
export const rechargeBalance = async (userId, amount) => {
  try {
    const response = await axios.post(`${API_URL}/users/recharge`, {
      userId,
      amount
    });
    return response.data;
  } catch (error) {
    console.error('充值失败', error);
    throw error;
  }
};

// 消费余额
export const spendBalance = async (userId, amount, purpose) => {
  try {
    const response = await axios.post(`${API_URL}/users/spend`, {
      userId,
      amount,
      purpose
    });
    return response.data;
  } catch (error) {
    console.error('消费失败', error);
    throw error;
  }
};

// 添加积分
export const addPoints = async (userId, points, source) => {
  try {
    const response = await axios.post(`${API_URL}/users/addPoints`, {
      userId,
      points,
      source
    });
    return response.data;
  } catch (error) {
    console.error('添加积分失败', error);
    throw error;
  }
};

// 使用积分
export const usePoints = async (userId, points, purpose) => {
  try {
    const response = await axios.post(`${API_URL}/users/usePoints`, {
      userId,
      points,
      purpose
    });
    return response.data;
  } catch (error) {
    console.error('使用积分失败', error);
    throw error;
  }
};