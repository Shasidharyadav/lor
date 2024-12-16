import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from '../Shared/Header';
import "../../styles/dashboard.css";

const DashboardLayout = ({ role, user, children }) => {
  const [collapsed, setCollapsed] = useState(false);

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
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
