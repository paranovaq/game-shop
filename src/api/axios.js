import axios from 'axios';

// Создаем базовый экземпляр axios с настройками
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем интерцепторы для обработки токенов авторизации
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Если токен истек или невалиден
      localStorage.removeItem('token');
      localStorage.removeItem('auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;