import React from "react";
import Header from "../components/Header";
import './AdminLogin.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import prakash from '/Users/prakashsingh/Documents/FarmToTableProject/Farm-to-table/src/components/prakash.jpg';

const AdminLogin = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    console.log("Email:", email);
    console.log("Password:", password);

    try {
      const response = await axios.post(
        "http://localhost:4000/adminpanel/api/v2/verifyAdmin",
        { email, password }
      );
      if (response.status === 200) {
        navigate("/admin"); // Redirect to admin page
      }
    } catch (error) {
      console.log("error", error);
      alert("Not an admin. Please check your credentials."); // Display error popup
    }
  };

  return (
    <div>
      <Header />
      <div className="admin-login-container">
        <div className="admin-login-box">
          <div className="admin-login-avatar">
            <img
            src = {prakash}
              alt="Admin Avatar"
              className="avatar-img"
            />
          </div>
          <h1 className="admin-login-title">Admin Login</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="text"
                name="email"
                id="email"
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="form-input"
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="form-button">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
