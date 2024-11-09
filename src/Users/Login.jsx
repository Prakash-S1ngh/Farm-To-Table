import React, { useContext, useState } from 'react';
import './Login.css';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import UserContext from './Context/UserContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Spinner state
  const { loggedin, setLoggedin,setUser,setFarmer } = useContext(UserContext);
  const navigate = useNavigate(); // For navigation

  const farmerlogin = async(e)=>{
    e.preventDefault();
    const logindata = { email, password };
    console.log("this is farmer login then why user bkl");

    try {
      setLoading(true); // Start spinner
      const res = await axios.post('http://localhost:4000/farmers/api/v2/farmlogin', logindata, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }, // Adjust header for JSON
      });

 
        setLoggedin(true);
        setFarmer(true);
        console.log(loggedin);
        navigate('/'); // Redirect using React Router
      
    } catch (error) {
      console.log('An error occurred in login page', error);
      // setLoggedin(false);
      // setFarmer(false);
    } finally {
      setLoading(false); // Stop spinner
    }

  }

  const handleLogin = async (e) => {
    e.preventDefault();
    const logindata = { email, password };

    try {
      setLoading(true); // Start spinner
      const res = await axios.post('http://localhost:4000/users/api/v2/login', logindata, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }, // Adjust header for JSON
      });

      if (res.status === 200) {
        setLoggedin(true);
        setUser(true);
        // setFarmer(false);
        console.log(loggedin);
        navigate('/'); // Redirect using React Router
      }
    } catch (error) {
      console.log('An error occurred in login page', error);
    } finally {
      setLoading(false); // Stop spinner
    }
  };

  return (
    <div className="login-container">
      {loading && (
        <div className="spinner-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      {/* Left Image Section */}
      <div className="image-section"></div>

      {/* Right Form Section */}
      <div className="form-section">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" onClick={handleLogin}>Login</button>

          <button type="button" className="forgot-password">
            <NavLink to="/forgotpassword">Forgot Password?</NavLink>
          </button>

          <button type="button" className="farmer-login" onClick={farmerlogin}>
            Login as Farmer
          </button>


          <button type="button" className="google-login">
            <img src="google-favicon.png" alt="Google Logo" />
            Login with Google
          </button>

          <button type="button" className="github-login">
            <img src="github-favicon.png" alt="GitHub Logo" />
            Login with GitHub
          </button>

          {/* New Login as Farmer Button */}
        
        </form>

      </div>
    </div>
  );
}

export default Login;
