import React, { useState } from 'react';
import axios from 'axios';
import './ResetPassword.css'; // Importing CSS

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    otp: '',
    newpassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sending data as JSON
      const response = await axios.post(
        'http://localhost:4000/users/api/v2/verifying',
       formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json' // Specify JSON content type
          }
        }
      );
      setMessage('Password successfully updated!');
    } catch (error) {
      console.log(error);
      setMessage('Failed to update password, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        <h2 className="reset-heading">Reset Password</h2>
        <form onSubmit={handleSubmit} className="reset-form">
          <div className="reset-inputGroup">
            <label htmlFor="otp" className="reset-label">OTP</label>
            <input
              type="text"
              id="otp"
              name="otp"
              required
              placeholder="Enter OTP"
              className="reset-input"
              value={formData.otp}
              onChange={handleChange}
            />
          </div>
          <div className="reset-inputGroup">
            <label htmlFor="newpassword" className="reset-label">New Password</label>
            <input
              type="password"
              id="newpassword"
              name="newpassword"
              required
              placeholder="Enter new password"
              className="reset-input"
              value={formData.newpassword}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="reset-button" disabled={loading}>
            {loading ? 'Submitting...' : 'Reset Password'}
          </button>
        </form>
        {message && <p className="reset-message">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
