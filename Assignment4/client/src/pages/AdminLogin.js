import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../cssFiles/Login.css';

const AdminLogin = () => {
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
      const response = await fetch('/api/admin/login', { // Update the route to /api/admin/login
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
            const errorData = await response.json();
            console.error('Login failed:', errorData.error);
            alert('Login failed');
        return;
        }

      if (response.ok) {
        // Clear the user data from local storage
        localStorage.removeItem('admin'); // Use a different key to store admin data

        // Store the admin data in local storage
        const admin = await response.json();
        localStorage.setItem('admin', JSON.stringify(admin));
        console.log(admin);

        console.log('Login successful');
        alert('Login successful');

        navigate('/Admin'); 
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData.error);
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

export default AdminLogin;
