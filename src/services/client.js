import axios from "axios";
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://localhost:8088';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 60000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Auto-detect FormData and set correct Content-Type
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - ADD THIS
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const message = error.response?.data?.error || 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại';
      
      // Show toast notification
      toast.error(message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      
      // Redirect after delay so user can see the message
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    }
    
    return Promise.reject(error);
  }
);

export default api;