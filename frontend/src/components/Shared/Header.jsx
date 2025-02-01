import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/header.css";
import defaultProfileImage from "../../assets/default-profile.png";
import { FaBars } from 'react-icons/fa';
import logoImage from "../../assets/logo.png";  // Import the logo image
import collapsedLogo from "../../assets/collapsed_logo.jpg";

const Header = ({ collapsed, setCollapsed }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

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
    // Remove "dashboard" from your path. Now we just do: /student/profile, /teacher/profile, /admin/profile
    if (role === 'student') {
      setDropdownVisible(false);
      navigate('/student/profile');
    } else if (role === 'teacher') {
      setDropdownVisible(false);
      navigate('/teacher/profile');
    } else if (role === 'admin') {
      setDropdownVisible(false);
      navigate('/admin/profile');
    }
  };

  const navigateToChangePassword = () => {
    if (role === 'student') {
      setDropdownVisible(false);
      navigate('/student/change-password');
    } else if (role === 'teacher') {
      setDropdownVisible(false);
      navigate('/teacher/change-password');
    } else if (role === 'admin') {
      setDropdownVisible(false);
      navigate('/admin/change-password');
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className={`header ${collapsed ? 'collapsed' : ''}`}>
      <div className='left-elements'>
        <div className={`logo-container ${collapsed ? 'collapsed' : ''}`}>
          {!collapsed && <img src={logoImage} alt="Logo" className="logo" />}
          {collapsed && <img src={collapsedLogo} alt="Logo" className='logo' />}
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
          <div className="profile-dropdown" ref={dropdownRef}>
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
