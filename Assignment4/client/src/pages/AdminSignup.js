import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../cssFiles/SignUp.css';

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    admin_permission: '',
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/admin/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          email: formData.email,
          admin_permission: formData.admin_permission, 
        }),
      });

      if (response.ok) {
        console.log('Admin signed up successfully');

        alert('Admin signed up successfully');
        navigate('/AdminLogin');
      } else {
        const errorData = await response.json();
        console.error('Signup failed:', errorData.error);
      }
    } catch (error) {
      console.error('An error occurred during signup:', error);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-form">
        <h1>Sign Up</h1>
        <form onSubmit={handleSignup}>
          <label>
            Username:
            <input type="text" name="username" value={formData.username} onChange={handleInputChange} />
          </label>
          <label>
            Password:
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
          </label>
            <label>
            Admin Permission:
            </label>
            <select name="admin_permission" value={formData.admin_permission} onChange={handleInputChange}>
                <option value="Read">Read</option>
                <option value="Write">Write</option>
                <option value="Admin">Admin</option>
            </select>
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default AdminSignup;
