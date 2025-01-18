import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8080",
  realm: "general_project",
  clientId: "frontend-client",
});

export default keycloak;
