import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, IdTokenClaims } from 'oidc-client-ts';
import { authService } from '../services/auth';

interface UserProfile extends IdTokenClaims {
  email_verified: boolean;
  roles: string[];
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
}

interface ExtendedUser extends User {
  profile: UserProfile;
}

interface AuthContextType {
  user: ExtendedUser | null;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await authService.getUser();
      setUser(currentUser as ExtendedUser);
    };

    loadUser();
    
    // Subscribe to user changes
    const handleUserLoaded = (user: User) => setUser(user as ExtendedUser);
    const handleUserUnloaded = () => setUser(null);

    authService.userManager.events.addUserLoaded(handleUserLoaded);
    authService.userManager.events.addUserUnloaded(handleUserUnloaded);

    return () => {
      authService.userManager.events.removeUserLoaded(handleUserLoaded);
      authService.userManager.events.removeUserUnloaded(handleUserUnloaded);
    };
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    login: authService.login,
    logout: authService.logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 