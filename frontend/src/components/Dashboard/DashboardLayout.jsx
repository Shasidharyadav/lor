import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from '../Shared/Header';
import "../../styles/dashboard.css";

const DashboardLayout = ({ role, user, children }) => {
  const [collapsed, setCollapsed] = useState(false); // State for sidebar collapse

  return (
    <div className="dashboard-layout">
      <Sidebar 
        role={role} 
        user={user} 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
      />
      <div className={`main-content ${collapsed ? 'collapsed' : ''}`}>
        <Header collapsed={collapsed} />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
