import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { AuthService, AuthData } from '../services/auth.service';

export default function Home() {
  const [authData, setAuthData] = useState<AuthData | null>(null);

  useEffect(() => {
    loadAuthData();
  }, []);

  const loadAuthData = async () => {
    const data = await AuthService.getAuthData();
    setAuthData(data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>Home Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
}); 