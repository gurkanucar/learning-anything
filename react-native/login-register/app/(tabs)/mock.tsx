import { View, Text, Button, StyleSheet } from 'react-native';
import { useState } from 'react';
import mockService from '../services/mock.service';

export default function MockScreen() {
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchPrivate = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await mockService.getPrivateData();
      setResponse(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch private data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mock Screen</Text>
      
      <Button 
        title={isLoading ? "Loading..." : "Fetch Private Data"} 
        onPress={handleFetchPrivate}
        disabled={isLoading}
      />

      {error && (
        <Text style={styles.error}>Error: {error}</Text>
      )}

      {response && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseTitle}>Response:</Text>
          <Text style={styles.responseText}>
            {JSON.stringify(response, null, 2)}
          </Text>
        </View>
      )}
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