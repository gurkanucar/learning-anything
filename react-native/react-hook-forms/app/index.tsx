import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';

export default function Index() {
  useEffect(() => {
    // Add a small delay to show splash screen
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>MyApp</Text>
      <ActivityIndicator 
        size="large" 
        color="#007AFF" 
        style={styles.spinner}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007AFF',
  },
  spinner: {
    marginTop: 20,
  },
});
