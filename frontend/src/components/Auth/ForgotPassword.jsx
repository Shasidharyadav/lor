import React, { useState } from 'react';
import logo from "../../assets/gitam_green_logo.png";
import { forgotPassword } from "../../services/api"; // Import the forgotPassword API method

const ForgotPassword = () => {
    document.title = 'Forgot Password';

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await forgotPassword(email); // Call the API to send a reset link
            setMessage(response.message); // Display success message
            setEmail(''); // Clear email input
        } catch (error) {
            setMessage(error.message || 'Failed to send reset email.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="form-container login">
                <img src={logo} className="gitamLogo" alt="logo" />
                <p className="title">Reset Password</p>
                <p className="message">Enter your email to reset your password</p>
                <label className="labels">
                    Email
                </label>
                <input
                    className="credentials"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button className="submit-btn" type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
                {message && <p className="message">{message}</p>} {/* Show message */}
            </form>
        </div>
    );
};

export default ForgotPassword;
