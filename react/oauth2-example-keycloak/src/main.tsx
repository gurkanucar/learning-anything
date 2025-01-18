import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./keycloak";
import { initAxiosInterceptors } from "./axiosClient";

import Router from "./routes/Router";
import "./index.css";
import AppLayout from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ReactKeycloakProvider
    authClient={keycloak}
    onTokens={({ token, refreshToken }) => {
      console.log("onTokens updated:", token, refreshToken);
      // sessionStorage.setItem("kc_token", token ?? "");
      // sessionStorage.setItem("kc_refreshToken", refreshToken ?? "");
    }}
    initOptions={{
      onLoad: "check-sso",
      silentCheckSsoRedirectUri:
        window.location.origin + "/silent-check-sso.html",
    }}
    onEvent={(event, error) => {
      console.log("Keycloak event:", event, "error:", error || "");
    }}
    // You can also handle onKeycloakEvent or onKeycloakTokens here if needed.
  >
    <BrowserRouter>
      <AppLayout>
        <Router />
      </AppLayout>
    </BrowserRouter>
  </ReactKeycloakProvider>
);

// Initialize Axios interceptors
initAxiosInterceptors(keycloak);
