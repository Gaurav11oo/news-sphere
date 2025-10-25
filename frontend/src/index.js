import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App"; // ✅ FIXED
import reportWebVitals from "./reportWebVitals";

// Get the root element
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Performance monitoring (optional)
reportWebVitals();
