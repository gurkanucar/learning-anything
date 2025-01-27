export { default as AuthApiService } from './auth.api';
export { default as UserApiService } from './user.api';

export default {
  AuthApiService: require('./auth.api').default,
  UserApiService: require('./user.api').default,
}; 