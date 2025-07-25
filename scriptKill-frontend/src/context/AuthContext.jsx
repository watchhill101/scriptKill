import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 从localStorage获取用户ID，然后从服务器获取最新用户信息
    const fetchUserData = async () => {
      const userId = localStorage.getItem('_id');
      if (userId) {
        try {
          // 从服务器获取最新的用户数据
          const res = await axios.get(`http://localhost:3000/users/profile/${userId}`);
          if (res.data.code === 200) {
            // 保存完整的用户数据
            const userData = res.data.data;
            setUser(userData);
            // 更新localStorage中的用户数据
            localStorage.setItem('userInfo', JSON.stringify(userData));
          } else {
            // 如果API请求失败，尝试使用localStorage中的数据
            const storedUser = localStorage.getItem('userInfo');
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            }
          }
        } catch (error) {
          console.error('获取用户数据失败:', error);
          // 如果API请求失败，尝试使用localStorage中的数据
          const storedUser = localStorage.getItem('userInfo');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('_id', userData._id);
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('_id');
    localStorage.removeItem('userInfo');
  };

  const updateUserInfo = async (userData = null) => {
    // 如果没有提供用户数据，从服务器刷新
    if (!userData && user?._id) {
      try {
        const res = await axios.get(`http://localhost:3000/users/profile/${user._id}`);
        if (res.data.code === 200) {
          const updatedUser = res.data.data;
          setUser(updatedUser);
          localStorage.setItem('userInfo', JSON.stringify(updatedUser));
          return updatedUser;
        }
      } catch (error) {
        console.error('刷新用户数据失败:', error);
      }
    } else if (userData) {
      setUser(userData);
      localStorage.setItem('userInfo', JSON.stringify(userData));
      return userData;
    }
    return user;
  };

  const isAuthenticated = () => {
    return !!user;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      updateUserInfo,
      isAuthenticated, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};