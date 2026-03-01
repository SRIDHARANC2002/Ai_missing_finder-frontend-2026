import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  // 🟡 Wait until authentication restore finishes
  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "18px",
          fontWeight: "500",
        }}
      >
        Loading...
      </div>
    );
  }

  // 🔴 Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔴 Role mismatch
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // 🟢 Access granted
  return children;
};

export default ProtectedRoute;