import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthApiService } from './api';
import { TokenDto, User } from "../types/auth";
import { AxiosError } from "axios";

const AUTH_KEY = "@auth_data";

export interface AuthData extends TokenDto {}

export class AuthService {
  static async login(
    email: string,
    password: string
  ): Promise<AuthData | null> {
    try {
      console.log("🔑 Attempting login for:", email);
      const response = await AuthApiService.login({ email, password });
      const authData = response.data;

      if (!authData?.accessToken || !authData?.refreshToken) {
        console.error("❌ Invalid auth data received:", authData);
        throw new Error("Invalid response data");
      }

      console.log("✅ Login successful, storing tokens...");
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(authData));
      await AsyncStorage.setItem("@auth_token", authData.accessToken);
      await AsyncStorage.setItem("@refresh_token", authData.refreshToken);

      return authData;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("❌ Login API error:", {
          status: error.response?.status,
          data: error.response?.data,
        });
        if (error.response?.status === 401) {
          throw new Error("Invalid credentials");
        }
        throw new Error(error.response?.data?.message || "Network error");
      }
      console.error("❌ Unexpected login error:", error);
      throw error;
    }
  }

  static async logout(): Promise<void> {
    console.log("🚪 Logging out, clearing auth data...");
    await AsyncStorage.multiRemove([AUTH_KEY, "@auth_token", "@refresh_token"]);
  }

  static async getAuthData(): Promise<AuthData | null> {
    const data = await AsyncStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      console.log("👤 Fetching current user...");
      const response = await AuthApiService.getMyself();
      console.log("✅ User data retrieved:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching user:", error);
      if (error instanceof AxiosError && error.response?.status === 401) {
        await this.logout();
      }
      return null;
    }
  }

  static async validateSession(): Promise<boolean> {
    try {
      console.log("🔍 Validating session...");
      const authData = await this.getAuthData();
      if (!authData?.accessToken) {
        console.log("❌ No auth data found");
        return false;
      }

      console.log("🔄 Verifying token with backend...");
      try {
        await AuthApiService.getMyself();
        console.log("✅ Session is valid");
        return true;
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("❌ API Error:", {
            status: error.response?.status,
            data: error.response?.data,
          });
          await this.logout();
        } else {
          console.error("❌ Unexpected error during validation:", error);
        }
        return false;
      }
    } catch (error) {
      console.error("❌ Session validation failed:", error);
      await this.logout();
      return false;
    }
  }
}

export default AuthService;
