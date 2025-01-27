import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../cssFiles/SignUp.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    email: '',
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('User signed up successfully');
        alert('User signed up successfully');
        navigate('/login');
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
            First Name:
            <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} />
          </label>
          <label>
            Last Name:
            <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} />
          </label>
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
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
