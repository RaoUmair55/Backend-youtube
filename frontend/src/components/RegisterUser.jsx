import React, { useState } from 'react';
import Login from './login';
import './Register.css'; // 👈 import the style

const RegisterUser = () => {
  const [isLogin, setIsLogin] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const apiUrl = `${import.meta.env.VITE_API_URL}/register`;
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Registration successful! Redirecting to login...');
        setIsLogin(true);
      } else {
        const error = await response.json();
        alert('Registration failed: ' + error.message);
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    }
  };

  return (
    <>
      {!isLogin ? (
        <div className="register-container">
          <h1>Register</h1>
          <form onSubmit={handleRegister} method="post">
            <input type="text" name="name" placeholder="Name" required />
            <input type="text" name="username" placeholder="Username" required />
            <input type="file" name="avatar" required />
            <input type="file" name="coverImage" required />
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Register</button>
          </form>
            <p>Already have an account? <button onClick={() => setIsLogin(true)}>Login</button></p>
        </div>
      ) : (
        <Login />
      )}
    </>
  );
};

export default RegisterUser;
