import React from 'react';
import "../../styles/global.css";
import defaultProfileImage from "../../assets/default-profile.png";

const ProfileCard = ({ profile, onClick }) => {
  return (
    <div className="profile-card" onClick={onClick}>
      <img
        src={profile.profileImage || defaultProfileImage}
        alt={profile.name}
        className="profile-image"
      />
      <h3>{profile.name}</h3>
      <p><strong>Department:</strong> {profile.department}</p>
      <p><strong>Email:</strong> {profile.email}</p>
    </div>
  );
};

export default ProfileCard;
