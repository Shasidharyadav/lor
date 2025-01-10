import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/header.css";
import defaultProfileImage from "../../assets/default-profile.png";
import { FaBars } from 'react-icons/fa';
import logoImage from "../../assets/logo.png"; // Import the logo image
import collapsedLogo from "../../assets/collapsed_logo.jpg";

const Header = ({ collapsed, setCollapsed }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  // Load the user role from local storage or context
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.role) {
      setRole(storedUser.role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navigateToProfile = () => {
    if (role === 'student') {
      setDropdownVisible(false);
      navigate('/dashboard/student/profile');
    } else if (role === 'teacher') {
      setDropdownVisible(false);
      navigate('/dashboard/teacher/profile');
    } else if (role === 'admin') {
      setDropdownVisible(false);
      navigate('/dashboard/admin/profile');
    }
  };

  const navigateToChangePassword = () => {
    if (role === 'student') {
      setDropdownVisible(false);
      navigate('/dashboard/student/change-password');
    } else if (role === 'teacher') {
      setDropdownVisible(false);
      navigate('/dashboard/teacher/change-password');
    } else if (role === 'admin') {
      setDropdownVisible(false);
      navigate('/dashboard/admin/change-password');
    }
  };

  return (
    <header className={`header ${collapsed ? 'collapsed' : ''}`}>
      <div className='left-elements'>
      <div className={`logo-container ${collapsed ? 'collapsed' : ''}`}>
        {!collapsed &&
          <img src={logoImage} alt="Logo" className="logo" />
        }
        {collapsed &&
          <img src={collapsedLogo} alt="Logo" className='logo' />
        }
      </div>
        <button
          className={`toggle-btn ${collapsed ? 'collapsed' : ''}`}
          onClick={() => setCollapsed((prev) => !prev)}
        >
          <FaBars />
        </button>
      </div>
      <div className="profile-container">
        <img
          src={defaultProfileImage}
          alt="Profile"
          className="profile-image-header"
          onClick={() => setDropdownVisible((prev) => !prev)}
        />
        {dropdownVisible && (
          <div className="profile-dropdown">
            <p onClick={navigateToProfile}>Profile</p>
            <p onClick={navigateToChangePassword}>Change Password</p>
            <p onClick={handleLogout}>Logout</p>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
