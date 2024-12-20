import { useAuthStore } from "@/store/authStore";
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user } = useAuthStore();

  return user ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;