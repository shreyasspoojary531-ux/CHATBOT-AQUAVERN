import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Chatbot from "./pages/Chatbot";
import Notifications from "./pages/Notifications";
import Services from "./pages/Services";
import Login from "./pages/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthInit from "./components/auth/AuthInit";
import ErrorBoundary from "./components/auth/ErrorBoundary";
import { ToastProvider } from "./components/ui/Toast";

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthInit>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/home" element={<Home />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/chatbot" element={<Chatbot />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/" element={<Navigate to="/home" replace />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthInit>
      </ToastProvider>
    </ErrorBoundary>
  );
}