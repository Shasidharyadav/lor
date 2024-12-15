import React from 'react';
import { Navigate } from 'react-router-dom';

const RoleBasedRedirect = ({ role }) => {
  if (role === 'student') return <Navigate to="/dashboard/student" replace />;
  if (role === 'teacher') return <Navigate to="/dashboard/teacher" replace />;
  if (role === 'admin') return <Navigate to="/dashboard/admin" replace />;
  return <Navigate to="/login" replace />;
};

export default RoleBasedRedirect;
