import apiService from '../api.service';
import { TokenDto, LoginRequest, RefreshTokenRequest, User } from '../../types/auth';

const { publicApi, privateApi } = apiService;

const AuthApiService = {
  login: (credentials: LoginRequest) => 
    publicApi.post<TokenDto>('/auth/login', credentials),
    
  refresh: (refreshToken: string) => 
    publicApi.post<TokenDto>('/auth/refresh', { refreshToken } as RefreshTokenRequest),
    
  getMyself: () => 
    privateApi.get<User>('/auth/get-myself'),
};

export default AuthApiService; 