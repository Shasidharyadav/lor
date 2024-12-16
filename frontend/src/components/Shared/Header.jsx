import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/header.css";
import defaultProfileImage from "../../assets/default-profile.png"; // Import the default profile image
import logoImage from "../../assets/logo.png"; // Import the logo image

const Header = ({ collapsed }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header className={`header ${collapsed ? 'collapsed' : ''}`}>
      <div className="logo-container">
        <img src={logoImage} alt="Logo" className="logo" />
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
            <p onClick={() => navigate('/profile')}>Profile</p>
            <p onClick={() => navigate('/change-password')}>Change Password</p>
            <p onClick={handleLogout}>Logout</p>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
