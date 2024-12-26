import React, { useState, useEffect } from 'react';
import "../../styles/global.css";
import DashboardLayout from '../Dashboard/DashboardLayout';
import "../../styles/changepassword.css";

const ChangePassword = () => {
  const [password, setPassword] = useState({ current: '', new: '' , confirm: '' });
  const [error, setError] = useState('');
  const [passwordRules, setPasswordRules] = useState({
    length: false,
    alphabet: false,
    spaces: false,
    number: false,
    specialCharNumber: false,
    matchConfirm: false,
  });

  const validatePassword = (value) => {
    setPasswordRules({
      length: value.length >= 8,
      alphabet: /[A-Za-z]/.test(value),
      spaces: value && !(/\s\s\s/.test(value) || value.startsWith(" ") || value.endsWith(" ")),
      specialCharNumber: /[0-9@#$%^&*(),.?":{}|<>]/.test(value),
      matchConfirm: value === password.confirm, 
    });
    return Object.values(passwordRules).every(Boolean);
  };

  const validateConfirmPassword = (value) => {
    setPasswordRules({
      matchConfirm: value === password.new,
    });
    return Object.values(passwordRules).every(Boolean);
  };

    
  const validateFields = (name, value) => {
    var error = {};
    console.log(name, value);
    if (name === 'current' && value !== '') {
      error.current = value === password.new ? '*Should be different from the New password': '';
    } else if (name === 'new' && value !== '') {
      error.new = value === password.current ? '*Should be different from the current password': '';
    } else if (name === 'confirm') {
      error.confirm = value === password.new ? '' : '*Passwords do not match';
    }else{
      delete error[name];
    }
    setError(error);

  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(password); // Replace with API call
  };

  return (
  <DashboardLayout>
    <h2>Change Password</h2>
    <form onSubmit={handleSubmit} className="change-password-form">
    <div>
      <label>
        Current password<span className="required">*</span>
      </label>
      <input 
        type="password" 
        placeholder="Enter current password" 
        value={password.current}
        onChange={(e) => {setPassword({ ...password, current: e.target.value });
        validateFields('current', e.target.value);
        }}
        required 
      />
      <div className="error">{error.current}</div>
    </div>
    <div>
      <label>
        New password<span className="required">*</span>
      </label>
      <input 
        type="password" 
        placeholder="Enter new password" 
        value={password.new}
        onChange={(e) => {setPassword({ ...password, new: e.target.value });
        validateFields('new', e.target.value);
        validatePassword(e.target.value);
        }}
        required />
      <div>
        {error.new && <span className="error">{error.new}</span>}
      </div>
        <div className="password-rules-cp">
          <div>
            <input
              className='changepassword-checkbox'
              type="checkbox"
              checked={passwordRules.length}
              readOnly
            />{" "}
            At least 8 characters
          </div>
          <div>
            <input
              className='changepassword-checkbox'
              type="checkbox"
              checked={passwordRules.alphabet}
              readOnly
            />{" "}
            At least 1 alphabet
          </div>
          <div>
            <input
              className='changepassword-checkbox'
              type="checkbox"
              checked={passwordRules.spaces}
              readOnly
            />{" "}
            At most 2 consecutive spaces and no leading/trailing spaces
          </div>
          <div>
            <input
              className='changepassword-checkbox'
              type="checkbox"
              checked={passwordRules.specialCharNumber}
              readOnly
            />{" "}
            At least 1 special character and 1 digit
          </div>
        </div>
      </div>
      <div>
          <label>
            Confirm password<span className="required">*</span>
          </label>
          <input
            type="password"
            placeholder="Confirm new password"
            value={password.confirm}
            onChange={(e) => {setPassword({ ...password, confirm: e.target.value });
            validateFields('confirm', e.target.value);
            validateConfirmPassword(e.target.value);
            }}
            required
            />
        <div className='password-rules-cp'>
          <input
            className='changepassword-checkbox'
            type="checkbox"
            checked={passwordRules.matchConfirm}
            readOnly
          />{" "}
          Passwords are matching
        </div>
      </div>
      <button type="submit" className='changepassword-btn'>Change password</button>
    </form>
  </DashboardLayout>
  );
};

export default ChangePassword;
