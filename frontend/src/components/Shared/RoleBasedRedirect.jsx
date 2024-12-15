import React from 'react';
import { Navigate } from 'react-router-dom';

const RoleBasedRedirect = ({ role }) => {
  const routes = {
    student: '/dashboard/student',
    teacher: '/dashboard/teacher',
    admin: '/dashboard/admin',
  };

  return <Navigate to={routes[role]} replace />;
};

export default RoleBasedRedirect;
