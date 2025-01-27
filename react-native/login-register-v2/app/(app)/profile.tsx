import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { AuthService, AuthData } from '../services/auth.service';

export default function Profile() {
  const [authData, setAuthData] = useState<AuthData | null>(null);

  useEffect(() => {
    loadAuthData();
  }, []);

  const loadAuthData = async () => {
    const data = await AuthService.getAuthData();
    setAuthData(data);
  };

  const handleLogout = async () => {
    await AuthService.logout();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.email}>{authData?.email}</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 18,
    color: '#666',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  button: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 5,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 