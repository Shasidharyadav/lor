import React, { useState } from 'react';
import logo from "../../assets/gitam_green_logo.png";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className='form-container login'>
                <img src={logo} className="gitamLogo" alt="logo" />
                <p className="title">Reset Password</p>
                <p className="message">Enter your email to reset your password</p>
                <label className='labels'>
                    Email
                </label>
                <input
                        className='credentials'
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                <button className='submit-btn' type="submit">Submit</button>
            </form>
        </div>
    );
};

export default ForgotPassword;