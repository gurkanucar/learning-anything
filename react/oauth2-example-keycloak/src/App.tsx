import { ReactKeycloakProvider } from '@react-keycloak/web';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Keycloak from 'keycloak-js';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import { useCallback } from 'react';

// Initialize Keycloak instance
const keycloakConfig = {
  url: 'http://localhost:8080',
  realm: 'general_project',
  clientId: 'public_client'
};

// Create a new instance only when needed
const keycloak = new Keycloak(keycloakConfig);

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = keycloak.authenticated;
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
}

function App() {
  // Handle events using useCallback to prevent unnecessary re-renders
  const onKeycloakEvent = useCallback((event: any, error: any) => {
    if (error) {
      console.error('Keycloak Error:', error);
    }
  }, []);

  const onKeycloakTokens = useCallback((tokens: any) => {
    console.log('Keycloak Tokens:', tokens);
  }, []);

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        onLoad: 'check-sso',
        redirectUri: window.location.origin,
        checkLoginIframe: false // Disable iframe checking
      }}
      onEvent={onKeycloakEvent}
      onTokens={onKeycloakTokens}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </ReactKeycloakProvider>
  );
}

export default App;
