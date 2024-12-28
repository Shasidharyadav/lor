import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from '../Shared/Header';
import "../../styles/global.css";
import "../../styles/sidebar.css";
import "../../styles/dashboard.css"
const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false); // State for managing sidebar collapse
  const user = JSON.parse(localStorage.getItem('user')) || {};

  return (
    <div className="layout">
      {/* Sidebar */}
      <Sidebar
        role={user.role}
        user={user}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <Header collapsed={collapsed} />
        {/* Page Content */}
        <div className="content">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
