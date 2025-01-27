import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_KEY = "@auth_data";

export interface AuthData {
  email: string;
  token: string;
}

export class AuthService {
  static async login(
    email: string,
    password: string
  ): Promise<AuthData | null> {
    // Simulate API call
    if (email === "a" && password === "a") {
      const authData: AuthData = {
        email,
        token: "fake-token-" + Math.random(),
      };

      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(authData));
      return authData;
    }
    return null;
  }

  static async logout(): Promise<void> {
    await AsyncStorage.removeItem(AUTH_KEY);
  }

  static async getAuthData(): Promise<AuthData | null> {
    const data = await AsyncStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  }
}

export default AuthService;
