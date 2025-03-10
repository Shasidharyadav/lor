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
  FaChartBar,
  FaTrash,
  FaDownload,
} from 'react-icons/fa';
import "../../styles/sidebar.css";
import defaultProfileImage from "../../assets/default-profile.png";

const Sidebar = ({ role, user, collapsed, setCollapsed }) => {
  const userData = user || JSON.parse(localStorage.getItem('user')) || {};

  // Base teacher links
  let teacherLinks = [
    { to: '/teacher/dashboard', label: 'Dashboard', icon: <FaHome /> },
    { to: '/teacher/accept-lor', label: 'All LoR Requests', icon: <FaEnvelope /> },
    { to: '/teacher/pending-requests', label: 'Pending Requests', icon: <FaClipboardList /> },
    { to: '/teacher/accepted-requests', label: 'Finished Requests', icon: <FaCheckCircle /> },
    { to: '/teacher/request-lor-delete', label: 'Request LoR Deletion', icon: <FaTrash /> },
  ];

  if (userData.status === 'HOD') {
    teacherLinks.push(
      { to: '/teacher/view-analysis', label: 'View Analysis', icon: <FaChartBar /> },
      // { to: '/teacher/hod-management', label: 'HOD Management', icon: <FaFileAlt /> }
    );
  } else if (userData.status === 'HOI') {
    teacherLinks.push(
      { to: '/teacher/view-analysis', label: 'View Analysis', icon: <FaChartBar /> },
      // { to: '/teacher/hoi-management', label: 'HOI Management', icon: <FaFileAlt /> }
    );
  }

  const links = {
    student: [
      { to: '/student/dashboard', label: 'Dashboard', icon: <FaHome /> },
      { to: '/student/faculty-profiles', label: 'Faculty Profiles', icon: <FaUsers /> },
      { to: '/student/apply-lor', label: 'Apply LoR', icon: <FaEdit /> },
      { to: '/student/view-requests', label: 'All LoR Requests', icon: <FaEnvelope /> },
      { to: '/student/pending-requests', label: 'Pending Requests', icon: <FaClipboardList /> },
      { to: '/student/accepted-requests', label: 'Finished Requests', icon: <FaDownload /> },
    ],
    teacher: teacherLinks,
    admin: [
      { to: '/admin/dashboard', label: 'Dashboard', icon: <FaHome /> },
      {to: '/admin/manage-faculty', label: 'Manage Faculty', icon: <FaUsers/>},
      // { to: '/admin/all-faculty', label: 'All Faculty', icon: <FaUsers /> },
      {to: '/admin/manage-students', label: 'Manage Students', icon: <FaUsers />},
      // { to: '/admin/all-students', label: 'All Students', icon: <FaUsers /> },
      { to: '/admin/add-user', label: 'Manage Dept. Admin', icon: <FaUserPlus /> },
      { to: '/admin/manage-hoi', label: 'Manage HoI', icon: <FaUserPlus /> },
      { to: '/admin/manage-hod', label: 'Manage HoD', icon: <FaUserPlus /> },
      { to: '/admin/delete-lor-request', label: 'Delete LoR Records', icon: <FaTrash /> },
      // { to: '/admin/manage-users', label: 'Add Users', icon: <FaUsers /> },
    ],
    department_admin: [
      {to: '/admin/dashboard', label: 'Dashboard', icon: <FaHome />},
      { to: '/admin/manage-hod', label: 'Manage HoD', icon: <FaUsers /> },
      {to: '/admin/manage-faculty', label: 'Manage Faculty', icon: <FaUsers/>},
      {to: '/admin/manage-students', label: 'Manage Students', icon: <FaUsers />},
      { to: '/admin/delete-lor-request', label: 'Delete LoR Records', icon: <FaTrash /> },
      // { to: '/admin/manage-users', label: 'Create Users', icon: <FaUsers /> },
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
            <p className="user-id">
              {userData?.id || 'User ID'}
              {userData?.role === 'teacher' && (userData.status === 'HOD' || userData.status === 'HOI') && ` - ${userData.status}`}
            </p>
          </>
        )}
      </div>
      <div className="sidebar-menu">
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
    </div>
  );
};

export default Sidebar;