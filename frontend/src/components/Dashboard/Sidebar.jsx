import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaHome,
  FaClipboardList,
  FaCheckCircle,
  FaUsers,
  FaFileAlt,
  FaUserPlus,
  FaBars,
} from 'react-icons/fa';
import "../../styles/sidebar.css";
import defaultProfileImage from "../../assets/default-profile.png";


const Sidebar = ({ role, user, collapsed, setCollapsed }) => {
  const userData = user || JSON.parse(localStorage.getItem('user')) || {}; // Ensure fallback to localStorage

  const links = {
    student: [
      { to: '/dashboard/student', label: 'Dashboard', icon: <FaHome /> },
      { to: '/dashboard/student/faculty-profiles', label: 'Faculty Profiles', icon: <FaUsers /> },
      { to: '/dashboard/student/apply-lor', label: 'Apply LoR', icon: <FaClipboardList /> },
      { to: '/dashboard/student/pending-requests', label: 'Pending Requests', icon: <FaClipboardList /> },
      { to: '/dashboard/student/accepted-requests', label: 'Accepted Requests', icon: <FaCheckCircle /> },
    ],
    teacher: [
      { to: '/dashboard/teacher', label: 'Dashboard', icon: <FaHome /> },
      { to: '/dashboard/teacher/accept-lor', label: 'LoR Requests', icon: <FaClipboardList /> },
      { to: '/dashboard/teacher/pending-requests', label: 'Pending Requests', icon: <FaClipboardList /> },
      { to: '/dashboard/teacher/accepted-requests', label: 'Accepted Requests', icon: <FaCheckCircle /> },
    ],
    admin: [
      { to: '/dashboard/admin', label: 'Dashboard', icon: <FaHome /> },
      { to: '/dashboard/admin/manage-users', label: 'Manage Users', icon: <FaUsers /> },
      { to: '/dashboard/admin/generate-reports', label: 'Generate Reports', icon: <FaFileAlt /> },
      { to: '/dashboard/admin/add-user', label: 'Add User', icon: <FaUserPlus /> },
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
