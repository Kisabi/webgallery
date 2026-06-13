import axios from 'axios';

/**
 * Налаштований екземпляр Axios для взаємодії з серверним REST API.
 * Базова URL-адреса вказує на серверну частину застосунку (порт 3000).
 */
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Request interceptor: автоматично додає JWT-токен до заголовка Authorization
 * у форматі Bearer перед відправкою кожного запиту.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Response interceptor: обробляє відповідь 401 Unauthorized —
 * видаляє недійсний токен та перенаправляє користувача на сторінку входу.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
