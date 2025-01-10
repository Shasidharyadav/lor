import React, { useEffect, useContext } from 'react';
import Sidebar from './Sidebar';
import Header from '../Shared/Header';
import {SidebarContext} from '../Shared/SidebarContext';
import "../../styles/dashboard.css";

const DashboardLayout = ({ children }) => {
  const {collapsed, setCollapsed} = useContext(SidebarContext);

  // Fetch user data from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  // Handle missing user (e.g., redirect to login if necessary)
  useEffect(() => {
    if (!user) {
      // If user is not authenticated, redirect to login
      window.location.href = '/login';
    }
  }, [user]);

  // Role is derived from user data
  const role = user?.role || 'guest'; // Default to 'guest' if role is unavailable

  return (
    <div className="dashboard-layout">
      {/* Sidebar with role, user, and collapse state */}
      <Sidebar 
        role={role} 
        user={user} 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
      />
      <div className={`main-content ${collapsed ? 'collapsed' : ''}`}>
        {/* Header with collapse control */}
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
