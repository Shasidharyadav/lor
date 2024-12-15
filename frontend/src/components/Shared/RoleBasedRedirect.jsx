import React from 'react';
import { Redirect } from 'react-router-dom';
import "../../styles/global.css";

const RoleBasedRedirect = ({ role }) => {
  const routes = {
    student: '/dashboard/student',
    teacher: '/dashboard/teacher',
    admin: '/dashboard/admin',
  };

  return <Redirect to={routes[role]} />;
};

export default RoleBasedRedirect;
