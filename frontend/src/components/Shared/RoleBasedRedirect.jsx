import React from 'react';
import { Navigate } from 'react-router-dom';

const RoleBasedRedirect = ({ role }) => {
  if (role === 'student') return <Navigate to="/student/dashboard" replace />;
  if (role === 'teacher') return <Navigate to="/teacher/dashboard" replace />;
  if (role === 'admin', 'department_admin') return <Navigate to="/admin/dashboard" replace />;
  
  return <Navigate to="/login" replace />;
};

export default RoleBasedRedirect;
