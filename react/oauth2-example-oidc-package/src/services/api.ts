import axios from 'axios';
import { authService } from './auth';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Updated to match your API endpoint
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token
api.interceptors.request.use(
  async (config) => {
    const user = await authService.getUser();
    if (user?.access_token) {
      config.headers.Authorization = `Bearer ${user.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get the current user
        const currentUser = await authService.getUser();
        
        if (currentUser) {
          // Trigger token refresh
          const user = await authService.userManager.signinSilent();
          
          if (user?.access_token) {
            // Update the request header with the new token
            originalRequest.headers.Authorization = `Bearer ${user.access_token}`;
            // Retry the original request
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // If refresh fails, redirect to login
        await authService.login();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Helper methods for common API operations
export const apiService = {
  get: async <T>(url: string) => {
    const response = await api.get<T>(url);
    return response.data;
  },

  post: async <T>(url: string, data: any) => {
    const response = await api.post<T>(url, data);
    return response.data;
  },

  put: async <T>(url: string, data: any) => {
    const response = await api.put<T>(url, data);
    return response.data;
  },

  delete: async <T>(url: string) => {
    const response = await api.delete<T>(url);
    return response.data;
  },
};

export default api; 