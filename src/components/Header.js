import React, { useContext } from 'react';
import log from './logo1.png';
import { Heart, ShoppingCart, User, PlusSquare } from 'lucide-react'; // Icons
import './Header.css';
import { Link } from 'react-router-dom';
import UserContext from '../Users/Context/UserContext';

const Header = () => {
  const { loggedin, setLoggedin, isFarmer , setFarmer ,isUser , setUser } = useContext(UserContext);

  const handleLogout = () => {
    setLoggedin(false); // Set loggedin to false on logout
    if(isFarmer==true){
      setFarmer(false);
    }
    if(isUser==true){
      setUser(false);
    }
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img src={log} alt="FarmToTable Logo" className="logo-image" />
        <div className="logo-text">FarmToTable</div>
      </div>

      <nav>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/Shop'>Shop</Link></li>
          <li>Category</li>
          <li>Testimonials</li>
          <li><Link to='/about-us'>About Us</Link></li>
          <li>Contact Us</li>
        </ul>
      </nav>

      <div className="auth-section">
        {loggedin ? (
          isFarmer ? (
            // Farmer-specific navigation
            <div className="farmer-icons">
              <Link to="/UserProfile">
                <User className="icon" />
              </Link>
              <Link to="/addproducts">
                <PlusSquare className="icon" title="Add Product" />
              </Link>
              <button onClick={handleLogout} className="logout-button">
                Sign Out
              </button>
            </div>
          ) : (
            // User-specific navigation
            <div className="user-icons">
              <Heart className="icon" />
              <Link to='/Cart'>
              <ShoppingCart className="icon" />
              </Link>
              <Link to="/UserProfile">
                <User className="icon" />
              </Link>
              <button onClick={handleLogout} className="logout-button">
                <Link to='/'>Sign Out</Link>
              </button>
            </div>
          )
        ) : (
          // Render login and signup buttons when not logged in
          <div className="auth-buttons">
            <button className="login-button">
              <Link to="/login">Login</Link>
            </button>
            <button className="signup-button">
              <Link to="/signin">Signup</Link>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
