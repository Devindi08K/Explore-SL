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

// Create API instance without /api prefix
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'https://explore-sl.onrender.com',
  withCredentials: true
});

// Request Interceptor: Attaches the token to every outgoing request.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    config.headers['X-Session-ID'] = getSessionId(); // Add session ID to each request
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handles 401 Unauthorized errors globally.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the error is a 401 Unauthorized
    if (error.response && error.response.status === 401) {
      console.error("API Error: 401 Unauthorized. Token is invalid or expired.");
      
      // Prevent multiple redirects
      if (window.location.pathname !== '/login') {
        // Clear any invalid user data from storage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        // Force a redirect to the login page.
        window.location.href = '/login?session_expired=true';
      }
    }
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