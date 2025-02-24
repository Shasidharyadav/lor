import React from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';

const DepartmentAdminDashboard = () => {
  document.title = 'Department Admin Dashboard';
  
  // Retrieve the logged-in user from localStorage (if needed)
  const user = JSON.parse(localStorage.getItem('user')) || {};

  return (
    <DashboardLayout role={user.role} user={user}>
      <h2>Department Admin Dashboard</h2>
      {/* 
        No stats or charts—just a heading. 
        You can add more content here if you want.
      */}
    </DashboardLayout>
  );
};

export default DepartmentAdminDashboard;
