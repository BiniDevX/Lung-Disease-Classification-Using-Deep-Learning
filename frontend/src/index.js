import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Find the root element in your HTML
const rootElement = document.getElementById("root");
// Create a root for your React app
const root = createRoot(rootElement);

// Render your App within the root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
