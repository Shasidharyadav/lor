import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to the correct dashboard if role doesn't match
    return <Navigate to={`/dashboard/${user?.role}`} replace />;
  }

  return children; // Render the protected content if authentication and role match
};

export default ProtectedRoute;
