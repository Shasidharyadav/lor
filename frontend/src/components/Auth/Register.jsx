import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/api'; // API service
import "../../styles/global.css";

const Register = () => {
  const [role, setRole] = useState(null); // Role selection: student or teacher
  const [form, setForm] = useState({}); // Form data state
  const [errors, setErrors] = useState({}); // Validation errors
  const [success, setSuccess] = useState(''); // Success message
  const navigate = useNavigate();

  // Form validation logic
  const validateForm = () => {
    const newErrors = {};

    // Common validations
    if (!form.id || form.id.trim() === '') newErrors.id = 'ID is required';
    if (!form.name || form.name.trim() === '') newErrors.name = 'Name is required';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.(in|edu)$/.test(form.email))
      newErrors.email = 'Invalid email domain (must be .in or .edu)';
    if (role === 'student' && (!form.phone || !/^\d{10}$/.test(form.phone)))
      newErrors.phone = 'Phone number must be 10 digits';
    if (!form.password || form.password.includes(' '))
      newErrors.password = 'Password cannot contain spaces';
    if (!form.confirmPassword || form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    // Role-specific validations
    if (role === 'student') {
      if (!form.campus) newErrors.campus = 'Campus is required';
      if (!form.department) newErrors.department = 'Department is required';
    } else if (role === 'teacher') {
      if (!form.designation) newErrors.designation = 'Designation is required';
      if (!form.department) newErrors.department = 'Department is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // Send data to the backend via API
        await registerUser({ ...form, role });
        setSuccess('Registration successful! You can now log in.');
        setForm({}); // Reset form
        setRole(null); // Reset role selection
      } catch (err) {
        setErrors({ general: err.response?.data?.message || 'Something went wrong. Please try again.' });
      }
    }
  };

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  return (
    <div className="register-container">
      {!role ? (
        <div className="role-selection">
          <h2>Select Role</h2>
          <button onClick={() => setRole('student')}>Student</button>
          <button onClick={() => setRole('teacher')}>Teacher</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="register-form">
          <h2>{role === 'student' ? 'Student Registration' : 'Teacher Registration'}</h2>
          {errors.general && <p className="error">{errors.general}</p>}
          {success && <p className="success">{success}</p>}

          <input
            type="text"
            name="id"
            placeholder="ID"
            value={form.id || ''}
            onChange={handleChange}
          />
          {errors.id && <p className="error">{errors.id}</p>}

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name || ''}
            onChange={handleChange}
          />
          {errors.name && <p className="error">{errors.name}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email || ''}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}

          {role === 'student' && (
            <>
              <input
                type="text"
                name="phone"
                placeholder="+91 Phone Number"
                value={form.phone || ''}
                onChange={handleChange}
              />
              {errors.phone && <p className="error">{errors.phone}</p>}

              <select
                name="campus"
                value={form.campus || ''}
                onChange={handleChange}
              >
                <option value="">Select Campus</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Visakhapatnam">Visakhapatnam</option>
              </select>
              {errors.campus && <p className="error">{errors.campus}</p>}
            </>
          )}

          <select
            name="department"
            value={form.department || ''}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="Civil">Civil</option>
            <option value="Aero">Aero</option>
            <option value="Mech">Mech</option>
            <option value="CSE Specializations">CSE Specializations</option>
          </select>
          {errors.department && <p className="error">{errors.department}</p>}

          {role === 'teacher' && (
            <select
              name="designation"
              value={form.designation || ''}
              onChange={handleChange}
            >
              <option value="">Select Designation</option>
              <option value="Assistant Professor">Assistant Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Professor">Professor</option>
            </select>
          )}
          {errors.designation && <p className="error">{errors.designation}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password || ''}
            onChange={handleChange}
          />
          {errors.password && <p className="error">{errors.password}</p>}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword || ''}
            onChange={handleChange}
          />
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

          <button type="submit">Register</button>
          <button type="button" onClick={() => setRole(null)}>Go Back</button>
        </form>
      )}

      <div className="auth-navigation">
        <p>
          Already registered?{' '}
          <span className="link" onClick={() => navigate('/login')}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
