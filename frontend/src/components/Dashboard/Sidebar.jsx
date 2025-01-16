// src/components/Sidebar/Sidebar.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaHome,
  FaClipboardList,
  FaCheckCircle,
  FaUsers,
  FaFileAlt,
  FaUserPlus,
  FaEnvelope,
  FaEdit,
} from 'react-icons/fa';
import "../../styles/sidebar.css";
import defaultProfileImage from "../../assets/default-profile.png";

const Sidebar = ({ role, user, collapsed, setCollapsed }) => {
  const userData = user || JSON.parse(localStorage.getItem('user')) || {};

  // Updated links to remove "/dashboard/" prefix
  // and to reflect, for example, "/student/dashboard", "/teacher/dashboard", etc.
  const links = {
    student: [
      { to: '/student/dashboard', label: 'Dashboard', icon: <FaHome /> },
      { to: '/student/faculty-profiles', label: 'Faculty Profiles', icon: <FaUsers /> },
      { to: '/student/apply-lor', label: 'Apply LoR', icon: <FaEdit /> },
      { to: '/student/view-requests', label: 'LoR Requests', icon: <FaEnvelope /> },
      { to: '/student/pending-requests', label: 'Pending Requests', icon: <FaClipboardList /> },
      { to: '/student/accepted-requests', label: 'Accepted Requests', icon: <FaCheckCircle /> },
    ],
    teacher: [
      { to: '/teacher/dashboard', label: 'Dashboard', icon: <FaHome /> },
      { to: '/teacher/accept-lor', label: 'LoR Requests', icon: <FaEnvelope /> },
      { to: '/teacher/pending-requests', label: 'Pending Requests', icon: <FaClipboardList /> },
      { to: '/teacher/accepted-requests', label: 'Accepted Requests', icon: <FaCheckCircle /> },
    ],
    admin: [
      { to: '/admin/dashboard', label: 'Dashboard', icon: <FaHome /> },
      { to: '/admin/manage-users', label: 'Manage Users', icon: <FaUsers /> },
      { to: '/admin/generate-reports', label: 'Generate Reports', icon: <FaFileAlt /> },
      { to: '/admin/add-user', label: 'Add User', icon: <FaUserPlus /> },
    ],
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="user-profile">
        <img
          src={userData?.profileImage || defaultProfileImage}
          alt="User Profile"
          className={`profile-image ${collapsed ? 'collapsed' : ''}`}
        />
        {!collapsed && (
          <>
            <p className="user-name">{userData?.name || 'User Name'}</p>
            <p className="user-id">{userData?.id || 'User ID'}</p>
          </>
        )}
      </div>

      {/* Sidebar Links */}
      <ul>
        {links[role]?.map((link, index) => (
          <li key={index}>
            <NavLink
              to={link.to}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {link.icon} {!collapsed && <span>{link.label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
