export interface TokenDto {
  accessToken: string;
  refreshToken: string;
}

export interface UserDto {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

export interface AuthState {
  user: UserDto | null;
  tokens: TokenDto | null;
} 