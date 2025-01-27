import apiService from './api.service';
import { UserDto, TokenDto, AuthState } from '../types/auth.types';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_STATE_KEY = 'auth_state';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  confirmPassword: string;
}

interface AuthResponse {
  user: UserDto;
  tokens: TokenDto;
}

class AuthService {
  private static instance: AuthService;
  
  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async getStoredAuth(): Promise<AuthState | null> {
    try {
      const authStateStr = await AsyncStorage.getItem(AUTH_STATE_KEY);
      if (!authStateStr) return null;
      
      const authState: AuthState = JSON.parse(authStateStr);
      return authState;
    } catch (error) {
      console.log('❌ Error reading stored auth state:', error);
      return null;
    }
  }

  async saveAuth(authState: AuthState) {
    try {
      await AsyncStorage.setItem(AUTH_STATE_KEY, JSON.stringify(authState));
      // Also save tokens separately for the API service
      if (authState.tokens) {
        await apiService.setTokens(
          authState.tokens.accessToken,
          authState.tokens.refreshToken
        );
      }
    } catch (error) {
      console.log('❌ Error saving auth state:', error);
      throw error;
    }
  }

  async clearAuth() {
    try {
      await AsyncStorage.removeItem(AUTH_STATE_KEY);
      await apiService.clearTokens();
    } catch (error) {
      console.log('❌ Error clearing auth state:', error);
      throw error;
    }
  }

  async login({ email, password }: LoginCredentials): Promise<AuthResponse> {
    try {
      const tokens = await apiService.login(email, password);
      const user = await apiService.getMyself();
      return { user, tokens };
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

  async register({ email, password, confirmPassword }: RegisterCredentials): Promise<AuthResponse> {
    // Implement register endpoint when available
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      user: {
        id: '1',
        username: email,
        email: email,
        roles: ['USER'],
      },
      tokens: {
        accessToken: 'dummy-token',
        refreshToken: 'dummy-refresh-token',
      },
    };
  }

  async refreshToken(): Promise<TokenDto> {
    try {
      // Get stored auth state
      const authStateStr = await AsyncStorage.getItem(AUTH_STATE_KEY);
      if (!authStateStr) {
        throw new Error('No auth state found');
      }

      const authState: AuthState = JSON.parse(authStateStr);
      if (!authState.tokens?.refreshToken) {
        throw new Error('No refresh token found');
      }

      // Try to refresh token
      const newTokens = await apiService.refreshToken(authState.tokens.refreshToken);
      
      // Update stored auth state with new tokens
      await this.saveAuth({
        user: authState.user,
        tokens: newTokens,
      });

      return newTokens;
    } catch (error) {
      await this.clearAuth();
      throw error;
    }
  }

  async getMyself(): Promise<UserDto> {
    try {
      const response = await apiService.getMyself();
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw error; // Let the auth context handle 401 errors
        }
        throw new Error(error.response?.data?.message || 'Failed to get user data');
      }
      throw error;
    }
  }

  async logout(): Promise<void> {
    await this.clearAuth();
  }
}

const authService = AuthService.getInstance();
export default authService; 