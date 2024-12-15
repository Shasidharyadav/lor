import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/api';
import "../../styles/global.css";

const Login = () => {
  const [form, setForm] = useState({ id: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(form); // Call API
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Navigate to appropriate dashboard
      if (data.user.role === 'student') navigate('/dashboard/student');
      if (data.user.role === 'teacher') navigate('/dashboard/teacher');
      if (data.user.role === 'admin') navigate('/dashboard/admin');
    } catch (err) {
      setError(err.message);
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
          value={form.id}
          onChange={(e) => setForm({ ...form, id: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
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
