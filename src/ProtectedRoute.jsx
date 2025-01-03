import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // If no token is found, redirect to login
  if (!token) {
    // navigate("/login");
    return <Navigate to="/login" />;
  }

  return children; // Render the protected component
}
