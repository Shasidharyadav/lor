import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/header.css";
import defaultProfileImage from "../../assets/default-profile.png";

const Header = ({ collapsed }) => {
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
      navigate('/dashboard/student/profile');
    } else if (role === 'teacher') {
      navigate('/dashboard/teacher/profile');
    } else if (role === 'admin') {
      navigate('/dashboard/admin/profile');
    }
  };

  const navigateToChangePassword = () => {
    if (role === 'student') {
      navigate('/dashboard/student/change-password');
    } else if (role === 'teacher') {
      navigate('/dashboard/teacher/change-password');
    } else if (role === 'admin') {
      navigate('/dashboard/admin/change-password');
    }
  };

  return (
    <header className={`header ${collapsed ? 'collapsed' : ''}`}>
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
