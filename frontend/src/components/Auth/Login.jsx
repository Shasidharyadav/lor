import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/api';
import "../../styles/global.css";
import "../../styles/auth.css";
import logo from "../../assets/gitam_green_logo.png";

const Login = () => {
  const [credentials, setCredentials] = useState({ id: '', password: '' });
  const [error, setError] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    return `${num1} + ${num2}`;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const [num1, , num2] = captcha.split(" ");
    const sum = parseInt(num1) + parseInt(num2);
    if (!captchaAnswer || parseInt(captchaAnswer) !== sum) {
      setErrors({ captcha: "*Invalid Captcha" });
      return;
    }
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

  const resetCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaAnswer("");
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className='login'>
        <img src={logo} className="gitamLogo" alt="logo" />
        {error && <p className="error">{error}</p>}
        <label className="labels">User ID</label>
        <input
        className='credentials'
          type="text"
          placeholder="User ID"
          value={credentials.id}
          onChange={(e) => setCredentials({ ...credentials, id: e.target.value })}
          required
        />
        <label className="labels">Password</label>
        <input
        className='credentials'
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          required
        />

        <div className="captcha">
            <label className="captchaLabel">{captcha} =</label>
            <input
              className="captchaCredentials"
              type="text"
              name="captcha"
              value={captchaAnswer}
              onChange={(e) => setCaptchaAnswer(e.target.value)}
              placeholder="Enter sum"
            />
            <button
              type="button"
              onClick={resetCaptcha}
              className="refresh-btn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="15"
                fill="currentColor"
              >
              <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
              </svg>
            </button>
          </div>
          <div className="captcha-invalid">
            {errors.captcha && <span className="error">{errors.captcha}</span>}
          </div>
        <button className='submit-btn login' type="submit">Login</button>
        <p>
          <span className="link" onClick={() => navigate('/forgot-password')}>
            Forgot Password?
          </span>
        </p>
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
