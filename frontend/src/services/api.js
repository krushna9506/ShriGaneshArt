// Updated for free deployment: Vercel + Render + Neon
import axios from 'axios';

const getBaseURL = () => {
  const customUrl = localStorage.getItem('ganesha_api_url');
  if (customUrl) return customUrl;
  // Always ensure the base URL ends with /api
  const raw = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'https://ganesh-arts-api.onrender.com';
  return raw.endsWith('/api') ? raw : raw.replace(/\/$/, '') + '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,          // 15s timeout — accounts for Render cold start
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ganesha_token') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle GET request caching and 401 re-login
api.interceptors.response.use(
  (response) => {
    // If it's a successful GET request, cache the response in localStorage
    if (response.config && response.config.method === 'get') {
      const cacheKey = `ganesha_cache_${response.config.url}`;
      try {
        localStorage.setItem(cacheKey, JSON.stringify(response.data));
      } catch (e) {
        console.warn('[API Cache] Failed to write cache for:', response.config.url, e.message);
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // OFFLINE FALLBACK: For GET requests, check if we have a localStorage cached fallback
    if (originalRequest && originalRequest.method === 'get' && (!error.response || error.response.status >= 500)) {
      const cacheKey = `ganesha_cache_${originalRequest.url}`;
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        console.log('[API Offline] Server unreachable. Serving cached data for:', originalRequest.url);
        return Promise.resolve({
          data: JSON.parse(cachedData),
          status: 200,
          statusText: 'OK',
          headers: {},
          config: originalRequest,
          request: {}
        });
      }
    }

    // Handle 401 globally
    if (error.response?.status === 401) {
      localStorage.removeItem('ganesha_token');
      localStorage.removeItem('token');
      localStorage.removeItem('ganesha_user');
      window.location.reload();
    }
    
    return Promise.reject(error);
  }
);

export default api;
