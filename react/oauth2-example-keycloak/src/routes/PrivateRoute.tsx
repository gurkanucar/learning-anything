import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { keycloak, initialized } = useKeycloak();
  const location = useLocation();

  if (!initialized) {
    return <div>Loading...</div>;
  }

  if (!keycloak.authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
