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

  return <div>Redirecting to login...</div>;
};

export default Login;
