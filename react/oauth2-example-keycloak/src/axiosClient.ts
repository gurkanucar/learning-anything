import axios from "axios";
import { KeycloakInstance } from "keycloak-js";

let keycloak: KeycloakInstance | null = null;

export const initAxiosInterceptors = (kc: KeycloakInstance) => {
  keycloak = kc;

  // Request interceptor
  axios.interceptors.request.use(
    async (config) => {
      if (keycloak) {
        try {
          // Try to refresh token if it's close to expiring (30 seconds threshold)
          const refreshed = await keycloak.updateToken(30);
          if (refreshed) {
            console.log("Token refreshed");
          }

          // Add token to headers
          if (keycloak.token) {
            config.headers.Authorization = `Bearer ${keycloak.token}`;
          }
        } catch (error) {
          console.error("Failed to refresh token", error);
          // If refresh fails, redirect to login
          keycloak.logout();
          return Promise.reject(error);
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      // Handle 401 responses
      if (error.response?.status === 401 && keycloak) {
        try {
          // Try to refresh token
          const refreshed = await keycloak.updateToken(30);
          if (refreshed && error.config) {
            // Retry the original request with new token
            const config = error.config;
            config.headers.Authorization = `Bearer ${keycloak.token}`;
            return axios(config);
          }
        } catch (refreshError) {
          console.error("Token refresh failed", refreshError);
          // If refresh fails, redirect to login
          keycloak.logout();
        }
      }
      return Promise.reject(error);
    }
  );
};

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "", // Use environment variable for API URL
  timeout: 5000, // 5 second timeout
});

// Add a request interceptor specifically for this instance
axiosClient.interceptors.request.use(
  async (config) => {
    if (keycloak?.token) {
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient; 