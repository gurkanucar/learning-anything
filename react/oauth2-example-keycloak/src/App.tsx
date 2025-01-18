import React from "react";
import { useKeycloak } from "@react-keycloak/web";
import { Link } from "react-router-dom";

const LoadingScreen = () => (
  <div className="loading-container">
    <img src="vite.svg" alt="Logo" className="loading-logo" />
    <div className="loading-spinner" />
    <div className="loading-text">Initializing authentication...</div>
  </div>
);

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) {
    return <LoadingScreen />;
  }

  const handleLogout = () => {
    keycloak?.logout({
      redirectUri: window.location.origin,
    });
  };

  return (
    <div>
      <nav className="nav-container">
        <div className="nav-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
          <Link to="/profile" className="nav-link">
            Profile
          </Link>
          
          {/* Always show both links, but style them based on access */}
          <Link 
            to="/admin" 
            className={`nav-link admin-link ${!keycloak?.hasRealmRole('admin') ? 'disabled-link' : ''}`}
          >
            Admin
          </Link>
          <Link 
            to="/user" 
            className={`nav-link user-link ${
              !keycloak?.hasRealmRole('user') && !keycloak?.hasRealmRole('admin') ? 'disabled-link' : ''
            }`}
          >
            User
          </Link>

          {!keycloak?.authenticated && (
            <Link to="/login" className="nav-link">
              Login
            </Link>
          )}
          {keycloak?.authenticated && (
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </nav>
      <div>{children}</div>
    </div>
  );
};

export default AppLayout;
