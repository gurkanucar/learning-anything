import React, { useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Navigate, useLocation } from 'react-router-dom';

const Login: React.FC = () => {
  const { keycloak } = useKeycloak();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (keycloak && !keycloak.authenticated) {
      keycloak.login({
        redirectUri: window.location.origin + from
      });
    }
  }, [keycloak, from]);

  if (keycloak?.authenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="login-redirect-container">
      <div className="login-redirect-content">
        <div className="redirect-spinner"></div>
        <h2 className="redirect-title">Redirecting to Login</h2>
        <p className="redirect-message">Please wait while we redirect you to the login page...</p>
        <div className="redirect-progress">
          <div className="progress-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
