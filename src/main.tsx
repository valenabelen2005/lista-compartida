import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { GroupsProvider } from "./context/GroupsContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>          {/* ← AuthProvider envuelve GroupsProvider */}
        <GroupsProvider>
          <App />
        </GroupsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);