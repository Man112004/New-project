import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, roles = [] }) {
  const { auth, isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (roles.length > 0 && !roles.includes(auth.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
