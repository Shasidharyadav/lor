import React, { useState } from 'react';
import "../../styles/global.css";

const ChangePassword = () => {
  const [password, setPassword] = useState({ current: '', new: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(password); // Replace with API call
  };

  return (
    <form onSubmit={handleSubmit} className="change-password-form">
      <h2>Change Password</h2>
      <input
        type="password"
        placeholder="Current Password"
        value={password.current}
        onChange={(e) => setPassword({ ...password, current: e.target.value })}
      />
      <input
        type="password"
        placeholder="New Password"
        value={password.new}
        onChange={(e) => setPassword({ ...password, new: e.target.value })}
      />
      <button type="submit">Change Password</button>
    </form>
  );
};

export default ChangePassword;
