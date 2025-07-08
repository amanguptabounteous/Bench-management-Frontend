// src/api/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Attach token to every request
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 errors (optional: refresh token flow)
apiClient.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401) {
      // optional: refresh token logic here
      // or redirect to login:
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default apiClient;
