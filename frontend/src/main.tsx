import { createRoot } from "react-dom/client"
import "./index.css"
import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import Register from "./pages/register"
import Login from "./pages/login"
import { AuthProvider } from "./context/AuthContext"

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
)