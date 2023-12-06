import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../cssFiles/Login.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const navigate = useNavigate(); // Hook to navigate

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Login successful');
        navigate('/Home'); // Use navigate to redirect
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData.error);
        // Handle login failure (e.g., show an error message)
      }
    } catch (error) {
      console.error('An error occurred during login:', error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-form">
        <h1>Login</h1>
        <form>
          <label>
            Username:
            <input type="text" name="username" value={formData.username} onChange={handleInputChange} />
          </label>
          <label>
            Password:
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} />
          </label>
          <button type="button" onClick={handleLogin}>
            Log In
          </button>
      </form>
      </div>
    </div>
  );
};

export default LoginPage;