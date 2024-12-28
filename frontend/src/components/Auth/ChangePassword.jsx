import React, { useState } from 'react';
import DashboardLayout from '../Dashboard/DashboardLayout';
import { updatePassword } from '../../services/api'; // API method for updating password
import "../../styles/changepassword.css";

const ChangePassword = () => {
  const [password, setPassword] = useState({ current: '', new: '' , confirm: '' });
  const [error, setError] = useState({});
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
    setPasswordRules((prev) => ({
      ...prev,
      matchConfirm: value === password.new,
    });
    return Object.values(passwordRules).every(Boolean);
  };

    
  const validateFields = (name, value) => {
    const newErrors = {...error};
    console.log(name, value);
    var foundError = false;
    if (name === 'current' && value !== '') {
      newErrors.new = value === password.new ? '*Should be different from the New password': '';
      foundError = true;
    } else if (name === 'new' && value !== '') {
      newErrors.new = value === password.current ? '*Should be different from the current password': '';
      foundError = true;
    } else if (name === 'confirm') {
      newErrors.confirm = value === password.new ? '' : '*Passwords do not match';
      foundError = true;
    }else{
      delete newErrors[name];
    }
    setError(newErrors);
    if (foundError) {
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    for (let[key, value] of Object.entries(password)) {
      if ((validateFields(key, value) === false) || (validatePassword(value) === false) || (validateConfirmPassword(value) === false)) {
        console.log(key, value);
        document.getElementsByName(key)[0].focus();
        return false;
      }
    }
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
        name='current'
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
        name='new'
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
            name='confirm'
            placeholder="Confirm new password"
            value={password.confirm}
            onChange={(e) => {
              setPassword({ ...password, confirm: e.target.value });
              validateConfirmPassword(e.target.value);
            }}
            required
          />
          <div className="password-rules-cp">
            <input
              className="changepassword-checkbox"
              type="checkbox"
              checked={passwordRules.matchConfirm}
              readOnly
            /> Passwords are matching
          </div>
        </div>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <button type="submit" className="changepassword-btn">Change password</button>
      </form>
    </DashboardLayout>
  );
};

export default ChangePassword;
