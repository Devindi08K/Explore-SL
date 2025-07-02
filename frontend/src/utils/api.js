import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Generate a session ID if one doesn't exist
const getSessionId = () => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
    'X-Session-ID': getSessionId() // Add session ID to each request
  },
  withCredentials: true
});

// Add request interceptor for auth token
api.interceptors.request.use(
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

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle auth errors
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.log('Authentication error, redirecting to login...');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    console.error('API Error:', error.response?.data || error.message);
    
    return Promise.reject(error);
  }
);

// Improved fetch tour guides function that uses the api instance
api.fetchTourGuides = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await api.get('/tour-guides', { 
      signal: controller.signal 
    });
    
    clearTimeout(timeoutId);
    return response.data;
  } catch (error) {
    console.error("Error fetching tour guides:", error);
    return [];
  }
};

export default api;