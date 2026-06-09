import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Ganti dengan URL API Gateway backend ketika jalan (menggunakan IP lokal PC untuk akses HP/Emulator)
const BASE_URL = 'http://10.159.127.177:8080/api/v1'; 

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menyisipkan token ke setiap request
apiClient.interceptors.request.use(
  async (config) => {
    // Ambil token dari Zustand store secara langsung
    const token = useAuthStore.getState().token; 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle error global di sini (misal token expired -> auto logout)
    return Promise.reject(error);
  }
);
