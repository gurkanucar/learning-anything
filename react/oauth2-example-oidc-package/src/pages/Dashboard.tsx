import {  useState } from 'react';
import { apiService } from '../services/api';

interface ProtectedItem {
  id: number;
  name: string;
}

interface ProtectedData {
  message: string;
  data: {
    items: ProtectedItem[];
  };
}

const Dashboard = () => {
  const [data, setData] = useState<ProtectedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProtectedData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.get<ProtectedData>('/protected/data');
      setData(response);
    } catch (err) {
      setError('Failed to fetch protected data');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      
      <button 
        onClick={fetchProtectedData} 
        className="fetch-button"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Fetch Protected Data'}
      </button>

      {error && <div className="error-message">{error}</div>}
      
      {data && (
        <div className="data-container">
          <p className="response-message">{data.message}</p>
          <div className="items-grid">
            {data.data.items.map((item) => (
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
