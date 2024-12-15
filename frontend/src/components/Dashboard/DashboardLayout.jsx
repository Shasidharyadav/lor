import React from 'react';
import Sidebar from './Sidebar';
import Header from '../Shared/Header';
import "../../styles/global.css";

const DashboardLayout = ({ role, children }) => {
  return (
    <div className="dashboard-layout">
      <Sidebar role={role} />
      <div className="main-content">
        <Header />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
