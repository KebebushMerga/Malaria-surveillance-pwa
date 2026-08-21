import React from "react";
import ReactDOM from "react-dom/client";

import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./hooks/AuthContext";

import "./index.css";
import { registerSW } from "virtual:pwa-register";

registerSW({
  immediate: true,
});
ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </React.StrictMode>
);