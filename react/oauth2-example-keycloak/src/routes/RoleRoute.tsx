import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";

interface RoleRouteProps {
  children: React.ReactNode;
  requiredRoles: string[];
}

const RoleRoute: React.FC<RoleRouteProps> = ({ children, requiredRoles }) => {
  const { keycloak } = useKeycloak();
  const location = useLocation();

  if (!keycloak?.authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has any of the required roles or is admin
  const hasAccess = keycloak.hasRealmRole("admin") || 
    requiredRoles.some(role => keycloak.hasRealmRole(role));

  if (!hasAccess) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>Access Denied</h2>
          <p>You don't have the required permissions to access this page.</p>
          <p className="required-roles">
            Required role(s): {requiredRoles.join(" or ")}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleRoute;
