import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, Layout, theme } from 'antd';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';

const { Content } = Layout;

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
        <Layout style={{ minHeight: '100vh' }}>
          <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          <Content style={{ 
            display: 'flex',
            flexDirection: 'column',
            padding: '16px',
            height: 'calc(100vh - 64px)',
            overflow: 'auto'
          }}>
            <Routes>
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
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* Add more routes as needed */}
            </Routes>
          </Content>
        </Layout>
      </Router>
    </ConfigProvider>
  );
}

export default App;
