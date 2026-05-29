import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute() {
  const { accessToken } = useAuth();

  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
}
