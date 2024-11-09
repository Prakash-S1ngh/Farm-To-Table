import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Importing useNavigate
import './Forgot.css'; // Importing CSS

const Forgot = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();  // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:4000/users/api/v2/forgotpassword', { email });
      setMessage('OTP sent to your email!');
      setTimeout(() => {
        navigate('/verifyotp');  // Redirect to /verifyotp after OTP is sent
      }, 1000);  // Optional delay of 1 second before navigation
      window.location.href = '/verifyotp';

    } catch (error) {
      setMessage('Failed to send OTP, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="heading">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="form">
          <div className="inputGroup">
            <label htmlFor="email" className="label">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Enter your email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Forgot;
