import React, { useState } from 'react';
import axiosClient from '../axiosClient';

interface ProtectedItem {
  id: number;
  name: string;
}

interface ApiResponse {
  message: string;
  data: {
    items: ProtectedItem[];
  };
}

const Dashboard: React.FC = () => {
  const [responseData, setResponseData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleApiCall = async () => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get<ApiResponse>('/api/protected/data');
      setResponseData(response.data);
      setError('');
    } catch (error) {
      console.error('API call failed:', error);
      setError('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      <button 
        className="fetch-button" 
        onClick={handleApiCall}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Fetch Dashboard Data'}
      </button>

      {error && <div className="error-message">{error}</div>}
      
      {responseData && (
        <div className="data-container">
          <h2 className="response-message">{responseData.message}</h2>
          <div className="items-grid">
            {responseData.data.items.map((item) => (
              <div key={item.id} className="item-card">
                <span className="item-id">#{item.id}</span>
                <span className="item-name">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
