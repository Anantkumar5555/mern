import axios from 'axios';

let baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Robust safety check: Automatically append '/api' if missing from the configured environment URL
const cleanedURL = baseURL.replace(/\/+$/, '');
if (!cleanedURL.endsWith('/api')) {
  baseURL = `${cleanedURL}/api`;
} else {
  baseURL = cleanedURL;
}

const api = axios.create({
  baseURL,
});

// Inject JWT token on every request if present in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Automatically logout and redirect if a 401 Unauthorized occurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
