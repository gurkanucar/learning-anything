import React, {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthData, AuthService } from "./services/auth.service";
import { loginSchema, type LoginFormData } from "./utils/validation";
import * as WebBrowser from "expo-web-browser";
import { FontAwesome } from '@expo/vector-icons';
const deepLinkAddress = "exp://192.168.0.6:8081";

export default function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkAuth();
    handleDeepLink();
  }, []);

  useEffect(() => {
    const subscription = Linking.addEventListener("url", handleDeepLink);
    return () => {
      subscription.remove();
    };
  }, []);

  const handleDeepLink = async (event?: { url: string }) => {
    let url = event ? event.url : await Linking.getInitialURL();

    if (url) {
      console.log("🔗 Received deep link:", url);

      // Parse the URL
      const parsedUrl = new URL(url);
      if (!parsedUrl.href.startsWith(deepLinkAddress)) return;

      // Handle success case
      const token = parsedUrl.searchParams.get("token");
      if (token) {
        try {
          // Decode the token if it's base64 encoded
          const decodedToken = JSON.parse(atob(token));
          await AuthService.loginViaToken(decodedToken as AuthData);
          console.log("token", decodedToken);
          router.replace("/(app)/home");
        } catch (error) {
          console.error("❌ Error processing OAuth token:", error);
          Alert.alert("Error", "Failed to process authentication");
        }
      }

      // Handle error case
      const error = parsedUrl.searchParams.get("error");
      if (error) {
        Alert.alert("Authentication Error", decodeURIComponent(error));
      }
    }
  };

  const checkAuth = async () => {
    try {
      console.log("🔄 Checking authentication state...");
      const isValid = await AuthService.validateSession();
      if (isValid) {
        console.log("✅ Valid session found, redirecting to home...");
        router.replace("/(app)/home");
      } else {
        console.log("ℹ️ No valid session, staying on login page");
      }
    } catch (error) {
      console.error("❌ Error checking auth:", error);
    } finally {
      setInitializing(false);
    }
  };

  const handleOAuthLogin = async (provider: "github" | "google") => {
    try {
      setLoading(true);
      const authUrl = `http://192.168.0.6:8080/oauth2/authorization/${provider}`;

      // Open OAuth login in browser
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        // 'loginregisterappv2://oauth'
        "exp://192.168.0.6:8081"
      );

      if (result.type === "success") {
        // The auth flow will be handled by the deep link handler
        console.log("✅ OAuth browser session completed successfully");
      } else {
        console.log("❌ OAuth browser session was cancelled or failed");
        Alert.alert(
          "Authentication Cancelled",
          "The login process was cancelled"
        );
      }
    } catch (error) {
      console.error("❌ OAuth error:", error);
      Alert.alert("Error", "Failed to initialize authentication");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log("🔄 Submitting login form...");
      setLoading(true);
      const authData = await AuthService.login(data.email, data.password);

      if (authData) {
        console.log("✅ Login successful, redirecting to home...");
        router.replace("/(app)/home");
      }
    } catch (error) {
      console.error("❌ Login submission error:", error);
      let message = "Something went wrong";
      if (error instanceof Error) {
        message = error.message;
      }
      Alert.alert("Error", "username or password is incorrect");
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Email"
              value={value}
              onChangeText={onChange}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isSubmitting}
            />
          )}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email.message}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Password"
              value={value}
              onChangeText={onChange}
              secureTextEntry
              editable={!isSubmitting}
            />
          )}
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password.message}</Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.button, isSubmitting && styles.buttonDisabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      {/* OAuth Separator */}
      <View style={styles.oauthSeparator}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorText}>or continue with</Text>
        <View style={styles.separatorLine} />
      </View>

      {/* OAuth Buttons */}
      <View style={styles.oauthContainer}>
        <TouchableOpacity
          style={[styles.oauthButton, loading && styles.buttonDisabled]}
          onPress={() => handleOAuthLogin("github")}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <FontAwesome name="github" size={20} color="#fff" />
              <Text style={styles.oauthButtonText}>GitHub</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.oauthButton, styles.googleButton, loading && styles.buttonDisabled]}
          onPress={() => handleOAuthLogin("google")}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <FontAwesome name="google" size={20} color="#fff" />
              <Text style={styles.oauthButtonText}>Google</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Register Link */}
      <TouchableOpacity
        style={styles.registerLink}
        onPress={() => router.replace("/register")}
        disabled={isSubmitting}
      >
        <Text style={[styles.link, isSubmitting && styles.linkDisabled]}>
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    height: 50,
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  link: {
    color: "#007AFF",
    textAlign: "center",
  },
  linkDisabled: {
    opacity: 0.7,
  },
  oauthSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  separatorText: {
    marginHorizontal: 10,
    color: '#666',
    fontSize: 14,
  },
  oauthContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  oauthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#24292e',
    padding: 12,
    borderRadius: 5,
    width: '48%',
    height: 45,
  },
  oauthButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '600',
  },
  googleButton: {
    backgroundColor: '#DB4437',
  },
  registerLink: {
    marginTop: 10,
  },
});
