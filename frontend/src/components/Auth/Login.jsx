import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/api';
import "../../styles/global.css";

const Login = () => {
  const [credentials, setCredentials] = useState({ id: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(credentials); // API call to backend
      const { token, user } = response;

      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect based on role
      if (user.role === 'student') navigate('/dashboard/student');
      else if (user.role === 'teacher') navigate('/dashboard/teacher');
      else if (user.role === 'admin') navigate('/dashboard/admin');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <input
          type="text"
          placeholder="ID"
          value={credentials.id}
          onChange={(e) => setCredentials({ ...credentials, id: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          required
        />
        <button type="submit">Login</button>
      </form>
      <div className="auth-navigation">
        <p>
          Not registered?{" "}
          <span className="link" onClick={() => navigate('/register')}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
