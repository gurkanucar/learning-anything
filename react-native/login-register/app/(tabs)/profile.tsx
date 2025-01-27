import { View, Text, Button, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/auth.context';
import authService from '../services/auth.service';

export default function Profile() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await authService.getMyself();
      setUserData(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch user data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
      
      <View style={styles.userContainer}>
        <Text style={styles.email}>Current user: {user?.email}</Text>
        
        <Button 
          title="Refresh User Data" 
          onPress={fetchUserData}
          disabled={isLoading}
        />

        {error && (
          <Text style={styles.error}>Error: {error}</Text>
        )}

        {userData && (
          <View style={styles.responseContainer}>
            <Text style={styles.responseTitle}>User Data:</Text>
            <Text style={styles.responseText}>
              {JSON.stringify(userData, null, 2)}
            </Text>
          </View>
        )}
      </View>

      <Button 
        title={authLoading ? "Logging out..." : "Logout"} 
        onPress={logout}
        disabled={authLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userContainer: {
    width: '100%',
    marginBottom: 20,
  },
  email: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  responseContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    width: '100%',
  },
  responseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  responseText: {
    fontFamily: 'monospace',
  },
}); 