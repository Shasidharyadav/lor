import React, { useState } from 'react';
import logo from "../../assets/gitam_green_logo.png"; // Import your logo
import { resetPassword } from '../../services/api'; // Import the resetPassword function
import './pass.css'; // Optional CSS for styling

const ResetPassword = () => {
  document.title = 'Reset Password'; // Set page title

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const token = window.location.pathname.split('/').pop(); // Extract token from the URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await resetPassword(token, password); // Call the resetPassword API
      setMessage(response.message); // Display success message
    } catch (error) {
      setMessage(error.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="form-container reset-password">
        <img src={logo} className="gitamLogo" alt="logo" />
        <p className="title">Reset Your Password</p>
        <p className="message">Enter and confirm your new password</p>
        <label className="labels">New Password</label>
        <input
          className="credentials"
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label className="labels">Confirm Password</label>
        <input
          className="credentials"
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button className="submit-btn" type="submit" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
        {message && <p className="message">{message}</p>} {/* Display success or error message */}
      </form>
    </div>
  );
};

export default ResetPassword;
