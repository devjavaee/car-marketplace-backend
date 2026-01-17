import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// ➜ Ajouter le token aux requêtes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ➜ Gérer les 401 (SAUF login)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';

    const isAuthLogin = url.includes('/auth/login');

    if (status === 401 && !isAuthLogin) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
