import { Link } from 'expo-router';
import { View, Button, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/auth.context';
import { FormInput } from '../components/form/FormInput';
import { useForm } from '../hooks/useForm';

interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
}

const INITIAL_VALUES: RegisterForm = {
  email: '',
  password: '',
  confirmPassword: '',
};

const VALIDATION_RULES = {
  email: {
    required: true,
    pattern: /\S+@\S+\.\S+/,
  },
  password: {
    required: true,
    minLength: 6,
    customValidate: (value: string) => {
      if (!/(?=.*[0-9])/.test(value)) {
        return 'Password must contain at least one number';
      }
    },
  },
  confirmPassword: {
    required: true,
    matches: (value: string, formData: RegisterForm) => value === formData.password,
  },
};

export default function Register() {
  const { register, isLoading } = useAuth();
  const { formData, errors, handleChange, validate } = useForm<RegisterForm>({
    initialValues: INITIAL_VALUES,
    validationRules: VALIDATION_RULES,
  });

  const handleRegister = async () => {
    try {
      if (!validate()) return;
      await register(formData.email, formData.password, formData.confirmPassword);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      
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

      <FormInput
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChangeText={handleChange('confirmPassword')}
        error={errors.confirmPassword}
        secureTextEntry
        editable={!isLoading}
      />

      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Register" onPress={handleRegister} />
      )}
      
      <Link href="/(auth)/login" replace style={styles.link}>
        Already have an account? Login
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