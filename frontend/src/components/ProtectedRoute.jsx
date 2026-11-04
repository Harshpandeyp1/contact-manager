import { Navigate } from "react-router-dom";
import { useAuth } from "../Service/authContext.js";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  return user ? children : <Navigate to="/auth?mode=login" replace />;
}
