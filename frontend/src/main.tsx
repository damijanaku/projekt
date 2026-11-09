import { createRoot } from "react-dom/client"
import "./index.css"
import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import Register from "./pages/register"
import Login from "./pages/login"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./auth/ProtectedRoute"
import Dashboard from "./pages/(auth)/dashboard"
import CreateSalon from "./pages/(auth)/create-salon"
import InviteArtist from "./pages/(auth)/invite"
import { AcceptInvitation } from "./pages/(auth)/acceptinvitation"

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/create-salon" element={<CreateSalon />} />
          <Route path="/dashboard/invite" element={<InviteArtist />} />
          <Route path="/accept-invitation" element={<AcceptInvitation />} />
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
)
