import apiService from '../api.service';
import { User } from '../../types/auth';

const { privateApi } = apiService;

const UserApiService = {
  getProfile: () => 
    privateApi.get<User>('/user/profile'),
    
  updateProfile: (data: Partial<User>) => 
    privateApi.put<User>('/user/profile', data),
};

export default UserApiService; 