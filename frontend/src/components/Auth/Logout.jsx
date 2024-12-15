import React from 'react';
import { useHistory } from 'react-router-dom';
import '../../styles/global.css';

const Logout = () => {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.clear();
    history.push('/login');
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  );
};

export default Logout;
