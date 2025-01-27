import { Link } from 'expo-router';
import { View, Button, StyleSheet, Text, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/auth.context';
import { FormInput } from '../components/form/FormInput';
import { useForm } from '../hooks/useForm';

interface LoginForm {
  email: string;
  password: string;
}

const INITIAL_VALUES: LoginForm = {
  email: '',
  password: '',
};

const VALIDATION_RULES = {
  email: {
    required: true,
    // pattern: /\S+@\S+\.\S+/,
  },
  password: {
    required: true,
    minLength: 3,
  },
};

export default function Login() {
  const { login, isLoading } = useAuth();
  const { formData, errors, handleChange, validate } = useForm<LoginForm>({
    initialValues: INITIAL_VALUES,
    validationRules: VALIDATION_RULES,
  });

  const handleLogin = async () => {
    try {
      if (!validate()) return;
      await login(formData.email, formData.password);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      
      <FormInput
        placeholder="Email"
        value={formData.email}
        onChangeText={handleChange('email')}
        error={errors.email}
        editable={!isLoading}
        keyboardType="email-address"
      />

      <FormInput
        placeholder="Password"
        value={formData.password}
        onChangeText={handleChange('password')}
        error={errors.password}
        secureTextEntry
        editable={!isLoading}
      />

      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
      
      <Link href="/(auth)/register" replace style={styles.link}>
        Don't have an account? Register
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  link: {
    marginTop: 15,
    color: 'blue',
    textAlign: 'center',
  },
}); 