import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth"; // Adjust the path based on your project structure

function ProtectedRoute({ element, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    // If the user is not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // If the user does not have the correct role, redirect to unauthorized page or homepage
    return <Navigate to="/" replace />;
  }

  return element;
}

export default ProtectedRoute;
