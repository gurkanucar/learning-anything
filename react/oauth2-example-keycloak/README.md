pnpm install react-router-dom @react-keycloak/web keycloak-js

// Initialize Keycloak instance
const keycloakConfig = {
  url: 'http://localhost:8080',
  realm: 'general_project',
  clientId: 'public_client'
};
