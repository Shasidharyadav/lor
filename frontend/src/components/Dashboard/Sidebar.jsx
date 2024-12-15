import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaHome,
  FaClipboardList,
  FaCheckCircle,
  FaUsers,
  FaFileAlt,
  FaUserPlus,
} from 'react-icons/fa';
import "../../styles/global.css";

const Sidebar = ({ role }) => {
  const links = {
    student: [
      { to: '/dashboard/student', label: 'Dashboard', icon: <FaHome /> },
      { to: '/dashboard/student/apply-lor', label: 'Apply LoR', icon: <FaClipboardList /> },
      { to: '/dashboard/student/pending-requests', label: 'Pending Requests', icon: <FaClipboardList /> },
      { to: '/dashboard/student/accepted-requests', label: 'Accepted Requests', icon: <FaCheckCircle /> },
    ],
    teacher: [
      { to: '/dashboard/teacher', label: 'Dashboard', icon: <FaHome /> },
      { to: '/dashboard/teacher/accept-lor', label: 'Approve LoRs', icon: <FaClipboardList /> },
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
    <div className="sidebar">
      <h2>{role.charAt(0).toUpperCase() + role.slice(1)} Panel</h2>
      <ul>
        {links[role]?.map((link, index) => (
          <li key={index}>
            <NavLink
              to={link.to}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {link.icon} <span>{link.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
