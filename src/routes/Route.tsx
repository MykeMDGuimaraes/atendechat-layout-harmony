import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Auth/AuthContext";

interface RouteProps {
  children: React.ReactNode;
  isPrivate?: boolean;
}

const PrivateRoute: React.FC<RouteProps> = ({ children, isPrivate = false }) => {
  const { isAuth, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isPrivate && !isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (!isPrivate && isAuth) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
