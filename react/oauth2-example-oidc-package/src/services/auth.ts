import { UserManager, WebStorageStateStore, User } from 'oidc-client-ts';

const settings = {
  authority: 'http://localhost:8080/realms/general_project',
  client_id: 'frontend-client',
  redirect_uri: `${window.location.origin}/callback`,
  post_logout_redirect_uri: `${window.location.origin}`,
  response_type: 'code',
  scope: 'openid profile email roles',
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  
  loadUserInfo: true,
  automaticSilentRenew: true,
  monitorSession: true,
  
  usePkce: true,
  
  metadata: {
    issuer: 'http://localhost:8080/realms/general_project',
    authorization_endpoint: 'http://localhost:8080/realms/general_project/protocol/openid-connect/auth',
    token_endpoint: 'http://localhost:8080/realms/general_project/protocol/openid-connect/token',
    userinfo_endpoint: 'http://localhost:8080/realms/general_project/protocol/openid-connect/userinfo',
    end_session_endpoint: 'http://localhost:8080/realms/general_project/protocol/openid-connect/logout',
  },
  silentRequestTimeout: 10000,
  accessTokenExpiringNotificationTime: 60, // Notify 60 seconds before token expires
};

const userManager = new UserManager(settings);

export const authService = {
  userManager,
  
  login: async () => {
    await userManager.signinRedirect();
  },
  
  logout: async () => {
    await userManager.signoutRedirect();
  },
  
  handleCallback: async () => {
    const user = await userManager.signinRedirectCallback();
    return user;
  },
  
  getUser: async () => {
    const user = await userManager.getUser();
    return user;
  },
  
  // Add these new methods
  getAccessToken: async (): Promise<string | null> => {
    const user = await userManager.getUser();
    return user?.access_token || null;
  },

  isAuthenticated: async (): Promise<boolean> => {
    const user = await userManager.getUser();
    return !!user?.access_token;
  },

  // Method to check if token is about to expire
  isTokenExpiring: async (): Promise<boolean> => {
    const user = await userManager.getUser();
    if (!user) return false;
    
    const expiresIn = user.expires_in;
    return expiresIn !== undefined && expiresIn < 60; // Less than 60 seconds remaining
  },

  // Method to refresh token
  refreshToken: async (): Promise<User | null> => {
    try {
      const user = await userManager.signinSilent();
      return user;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  },
}; 