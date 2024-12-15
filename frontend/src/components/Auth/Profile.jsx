import React from 'react';
import "../../styles/global.css";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="profile">
      <h2>Profile</h2>
      <p>Username: {user.username}</p>
      <p>Role: {user.role}</p>
    </div>
  );
};

export default Profile;
