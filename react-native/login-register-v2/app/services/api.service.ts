import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.0.6:8080';

// Instance without auth token
export const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Instance with auth token
export const privateApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to inject token
privateApi.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
privateApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log('🔄 API Error:', {
      status: error.response?.status,
      url: originalRequest?.url,
      method: originalRequest?.method,
    });

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('🔄 Attempting token refresh...');
        const refreshToken = await AsyncStorage.getItem('@refresh_token');
        const response = await publicApi.post('/auth/refresh', {
          refreshToken,
        });

        const { accessToken } = response.data;
        await AsyncStorage.setItem('@auth_token', accessToken);

        console.log('✅ Token refreshed, retrying request');
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return privateApi(originalRequest);
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        await AsyncStorage.multiRemove(['@auth_token', '@refresh_token']);
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default {
  publicApi,
  privateApi,
}; 