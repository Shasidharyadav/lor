import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // If user has a role not in allowedRoles, redirect them to their own dashboard
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    if (user?.role === 'student') return <Navigate to="/student/dashboard" replace />;
    if (user?.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />;
    if (user?.role === 'admin')   return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return children; // Render the protected content if role is allowed
};

export default ProtectedRoute;
