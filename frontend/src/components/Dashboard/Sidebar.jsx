import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaClipboardList, FaCheckCircle, FaUsers, FaFileAlt, FaUserPlus } from 'react-icons/fa'; // Import icons
import "../../styles/global.css";

const Sidebar = ({ role }) => {
  const links = {
    student: [
      { to: '/dashboard/student', label: 'Dashboard', icon: <FaHome /> },
      { to: '/apply-lor', label: 'Apply LoR', icon: <FaClipboardList /> },
      { to: '/pending-requests', label: 'Pending Requests', icon: <FaClipboardList /> },
      { to: '/accepted-requests', label: 'Accepted Requests', icon: <FaCheckCircle /> },
    ],
    teacher: [
      { to: '/dashboard/teacher', label: 'Dashboard', icon: <FaHome /> },
      { to: '/accept-lor', label: 'Approve LoRs', icon: <FaClipboardList /> },
      { to: '/pending-requests', label: 'Pending Requests', icon: <FaClipboardList /> },
      { to: '/accepted-requests', label: 'Accepted Requests', icon: <FaCheckCircle /> },
    ],
    admin: [
      { to: '/dashboard/admin', label: 'Dashboard', icon: <FaHome /> },
      { to: '/manage-users', label: 'Manage Users', icon: <FaUsers /> },
      { to: '/generate-reports', label: 'Generate Reports', icon: <FaFileAlt /> },
      { to: '/add-user', label: 'Add User', icon: <FaUserPlus /> },
    ],
  };

  return (
    <div className="sidebar">
      <h2>Role: {role}</h2>
      <ul>
        {links[role]?.map((link, index) => (
          <li key={index}>
            <NavLink to={link.to} activeClassName="active">
              {link.icon} <span>{link.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
