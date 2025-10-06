// src/components/ProtectedRoute.jsx
import { useMemo } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isAuthenticated = useMemo(() => {
    const storedUser = sessionStorage.getItem("currentUser");
    if (!storedUser) return false;

    try {
      const userData = JSON.parse(storedUser);
      return !!userData.user_id && !!userData.role;
    } catch (e) {
      console.warn("Invalid user data in sessionStorage", e);
      sessionStorage.removeItem("currentUser");
      return false;
    }
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;