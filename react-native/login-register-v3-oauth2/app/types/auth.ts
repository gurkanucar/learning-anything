export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

export interface TokenDto {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export default {
  // You can add any utility functions here if needed
}; 