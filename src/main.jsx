import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import { RouterProvider } from "react-router-dom";
import router from "./app/routes";
import "./styles/globals.css";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
