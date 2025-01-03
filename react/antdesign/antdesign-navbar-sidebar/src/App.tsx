import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthLayout from './components/Layout/AuthLayout';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import FormDemo from './pages/FormDemo';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Router>
        <Routes>
          {/* Auth routes with AuthLayout */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Main routes with MainLayout */}
          <Route element={<MainLayout isDarkMode={isDarkMode} toggleTheme={toggleTheme} />}>
            <Route path="/" element={
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                textAlign: 'center',
                padding: '20px'
              }}>
                <h1>Welcome to My App</h1>
              </div>
            } />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/form" element={<FormDemo />} />
            {/* Add more main routes as needed */}
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
