import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.jsx"
import AuthProvider from "./context/AuthContext.jsx"
import { ThemeProvider } from "./context/ThemeContext.jsx"
import { Toaster } from "react-hot-toast"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              borderRadius: "12px",
            },
            success: {
              style: { background: "#0D9488", color: "#fff" },
            },
            error: {
              style: { background: "#ef4444", color: "#fff" },
            },
          }}
        />
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
)