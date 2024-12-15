import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/global.css";

const Header = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate(); // Replacing useHistory

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header className="header">
      <h1>LoR Management System</h1>
      <div className="profile" onClick={() => setDropdownVisible(!dropdownVisible)}>
        <img src="/assets/profile-placeholder.png" alt="Profile" />
        {dropdownVisible && (
          <div className="dropdown">
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
