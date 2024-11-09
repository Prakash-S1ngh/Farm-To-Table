import React from 'react';
// import './Footer.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
// import logo from './logo1.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-about">
        <div className="logo">
      {/* <img src={logo} alt="FarmToTable Logo" /> */}
      <h2>FarmToTable</h2>
  </div>
          {/* <h2>FarmToTable</h2> */}
          <p>Connecting farmers directly with consumers for fresh and sustainable produce.</p>
        </div>
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com" aria-label="Facebook"><FaFacebookF /></a>
            <a href="https://twitter.com" aria-label="Twitter"><FaTwitter /></a>
            <a href="https://instagram.com" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://linkedin.com" aria-label="LinkedIn"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} FarmToTable. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
