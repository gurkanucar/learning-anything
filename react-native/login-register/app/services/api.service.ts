import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { TokenDto } from '../types/auth.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.0.6:8080';

// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Add this interface to handle the retry property
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

class ApiService {
  private static instance: ApiService;
  public api: AxiosInstance;
  private authApi: AxiosInstance;

  private constructor() {
    // Create instance for authenticated requests
    this.api = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Create instance for authentication requests (login, refresh)
    this.authApi = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    this.setupLogging();
  }

  private setupLogging() {
    // Request logging
    const requestInterceptor = (config: any) => {
      console.log('🚀 Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        headers: config.headers,
        data: config.data,
      });
      return config;
    };

    // Response logging
    const responseInterceptor = (response: any) => {
      console.log('✅ Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
      return response;
    };

    // Error logging
    const errorInterceptor = (error: AxiosError) => {
      console.log('❌ Error:', {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      return Promise.reject(error);
    };

    // Apply logging interceptors to both instances
    this.api.interceptors.request.use(requestInterceptor);
    this.api.interceptors.response.use(responseInterceptor, errorInterceptor);
    this.authApi.interceptors.request.use(requestInterceptor);
    this.authApi.interceptors.response.use(responseInterceptor, errorInterceptor);
  }

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private async setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      async (config: CustomAxiosRequestConfig) => {
        const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;
        if (!originalRequest) {
          return Promise.reject(error);
        }

        // Only attempt refresh on 401 errors and if we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            const tokens = await this.refreshToken(refreshToken);
            originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            console.log('❌ Token refresh failed in interceptor');
            await this.clearTokens();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async setTokens(accessToken: string, refreshToken: string) {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  async clearTokens() {
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  // Auth endpoints (no token required)
  async login(email: string, password: string): Promise<TokenDto> {
    try {
      const response = await this.authApi.post<TokenDto>('/auth/login', {
        email,
        password,
      });

      // Only save tokens if we have valid data
      if (response.data?.accessToken && response.data?.refreshToken) {
        await this.setTokens(response.data.accessToken, response.data.refreshToken);
      } else {
        throw new Error('Invalid token data received');
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Invalid credentials');
        }
        throw new Error(error.response?.data?.message || 'Login failed');
      }
      throw error;
    }
  }

  // Protected endpoints (token required)
  async getMyself() {
    const response = await this.api.get('/auth/get-myself');
    if (response.status === 200 && response.data) {
      return response.data;
    }
    throw new Error('Failed to get user data');
  }

  async refreshToken(refreshToken: string): Promise<TokenDto> {
    try {
      console.log('🔄 Attempting token refresh...');
      const response = await this.authApi.post<TokenDto>('/auth/refresh', {
        refreshToken: refreshToken
      });

      if (response.status !== 200 || !response.data?.accessToken || !response.data?.refreshToken) {
        throw new Error('Invalid token data received');
      }

      console.log('✅ Token refresh successful, saving new tokens');
      await this.setTokens(response.data.accessToken, response.data.refreshToken);
      return response.data;
    } catch (error) {
      console.log('❌ Token refresh failed:', error);
      throw error;
    }
  }
}

const apiService = ApiService.getInstance();
export default apiService; 