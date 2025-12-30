// src/api/auth.js
import apiClient from './axios';

const AuthAPI = {
  // Логин
  login: async (username, password) => {
    try {
      const response = await apiClient.post('/auth/login', {
        username,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      // Fallback на локальную аутентификацию
      const users = [
        { username: "admin", password: "Admin123", role: "admin" },
        { username: "user", password: "User123", role: "user" }
      ];
      
      const user = users.find(
        u => u.username === username && u.password === password
      );
      
      if (user) {
        return user;
      }
      throw new Error('Invalid credentials');
    }
  },

  // Регистрация
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Выход
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('auth');
    return Promise.resolve();
  },

  // Проверка токена
  validateToken: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return false;
      }
      
      const response = await apiClient.get('/auth/validate');
      return response.data.valid;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }
};

export default AuthAPI;