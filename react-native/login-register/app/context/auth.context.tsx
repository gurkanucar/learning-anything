import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import authService from "../services/auth.service";
import { router, Href } from "expo-router";
import { UserDto, AuthState } from "../types/auth.types";
import { AppRoutes } from "../types/navigation.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

interface AuthContextType {
  user: UserDto | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STATE_KEY = "auth_state";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initialRoute, setInitialRoute] = useState<AppRoutes | null>(null);

  const handleAuthError = async () => {
    console.log("🔐 Auth Error: Clearing auth state and redirecting to login");
    await authService.clearAuth();
    setUser(null);
    setInitialRoute("/(auth)/login");
  };

  const safeNavigate = (route: AppRoutes) => {
    setInitialRoute(route);
  };

  // Handle navigation after initialization
  useEffect(() => {
    if (isInitialized && initialRoute) {
      const timer = setTimeout(() => {
        router.replace(initialRoute);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isInitialized, initialRoute]);

  // Load saved auth state and verify token
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        console.log("🔄 Initializing auth state...");

        const authState = await authService.getStoredAuth();
        console.log("📦 Stored auth state:", authState ? "Found" : "Not found");

        if (!authState?.tokens) {
          console.log("🚫 No stored tokens found");
          await handleAuthError();
          return;
        }

        try {
          console.log("🔍 Verifying stored tokens...");
          const userData = await authService.getMyself();

          if (!isMounted) return;

          console.log("✅ Token verification successful");
          setUser(userData);
          safeNavigate("/(tabs)/home");
        } catch (error) {
          if (!isMounted) return;

          if (axios.isAxiosError(error) && error.response?.status === 401) {
            console.log("⚠️ Token expired, attempting refresh...");
            try {
              await authService.refreshToken();
              const userData = await authService.getMyself();

              if (!isMounted) return;

              console.log("✅ Token refresh successful");
              setUser(userData);
              safeNavigate("/(tabs)/home");
            } catch (refreshError) {
              if (!isMounted) return;
              console.log("❌ Token refresh failed");
              await handleAuthError();
            }
          } else {
            console.log("❌ Unexpected error during verification:", error);
            await handleAuthError();
          }
        }
      } catch (error) {
        if (!isMounted) return;
        console.log("❌ Auth initialization failed:", error);
        await handleAuthError();
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { user, tokens } = await authService.login({ email, password });
      setUser(user);
      await authService.saveAuth({ user, tokens });
      safeNavigate("/(tabs)/home");
    } catch (error) {
      await handleAuthError();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    try {
      setIsLoading(true);
      const { user, tokens } = await authService.register({
        email,
        password,
        confirmPassword,
      });
      setUser(user);
      await authService.saveAuth({ user, tokens });
      safeNavigate("/(tabs)/home");
    } catch (error) {
      await handleAuthError();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      await handleAuthError();
    } catch (error) {
      await handleAuthError();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isInitialized, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthProvider;
