import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './Profile.css';
import userProfileImage from './images/UserPro.jpg';
import UserContext from './Context/UserContext';
import { Link } from 'react-router-dom';
// import farmerProfileImage from './images/FarmerPro.jpg'; // Add an image for the farmer's profile

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const { isFarmer , isUser , setUser , setFarmer ,loggedin, setLoggedin } = useContext(UserContext);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    country: '',
    profileImage:''
  });
  const [loading, setLoading] = useState(true);
  const logoutHandler = ()=>{
    if(isUser){
      setLoggedin(false);
      setUser(false);
    }
    if(isFarmer){
      setLoggedin(false);
      setFarmer(false);
    }
  }

  // Function to fetch user data from API
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/users/api/v2/GetUser', {
        withCredentials: true, // Include credentials in the request
      });
      console.log("this is user section ");
      setUserData(response.data.user);
      setFormData({
        firstName: response.data.user.first_name || '',
        lastName: response.data.user.last_name || '',
        email: response.data.user.email || '',
        phone: response.data.user.phone || '',
        street: response.data.user.street || '',
        city: response.data.user.city || '',
        postalCode: response.data.user.postal_code || '',
        country: response.data.user.country || '',
        state: response.data.user.state || '',
        profileImage: response.data.user.profile_image || null,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch farmer data from API
  const fetchFarmerData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/farmers/api/v2/getFarmer', {
        withCredentials: true, // Include credentials in the request
      });
      setUserData(response.data.farmer);
      setFormData({
        firstName: response.data.farmer.first_name || '',
        lastName: response.data.farmer.last_name || '',
        email: response.data.farmer.email || '',
        phone: response.data.farmer.phonenum || '',
        street: response.data.farmer.street || '',
        city: response.data.farmer.city || '',
        postalCode: response.data.farmer.postal_code || '',
        country: response.data.farmer.country || '',
        state: response.data.farmer.state || '',
        profileImage: response.data.farmer.profile_image || null,
      });
    } catch (error) {
      console.error('Error fetching farmer data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFarmer) {
      fetchFarmerData(); // Fetch farmer data if isFarmer is true
    } else {
      fetchUserData(); // Fetch user data otherwise
    }
  }, []);

  // Handle Save Changes
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isFarmer
        ? 'http://localhost:4000/farmers/api/v2/updateFarmer'
        : 'http://localhost:4000/users/api/v2/updateUser';

      await axios.post(url, formData, {
        withCredentials: true,
      });
      if (isFarmer) {
        await fetchFarmerData(); // Re-fetch farmer data after saving changes
      } else {
        await fetchUserData(); // Re-fetch user data after saving changes
      }
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Render placeholders if loading
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <nav className="profile-sidebar">
        <div className="profile-nav-content">
          <h2>Navigation</h2>
          <ul>
            <li><a href="#"><span className="nav-icon">📊</span> Dashboard</a></li>
            
            {!isFarmer && (
              <>
                <li><Link to='/ordersHistory'><span className="nav-icon">📜</span>Order History</Link></li>
                <li><a href="#"><span className="nav-icon">❤️</span> Wishlist</a></li>
                <li><a href="#"><span className="nav-icon">🛒</span> Shopping Cart</a></li>
              </>
            )}
            {isFarmer &&(
              <li><a href="/FarmProducts"><span className="nav-icon">📜</span>Farm Orders</a></li>
            )}
            <li onClick={logoutHandler}><Link to='/'><span className="nav-icon">🚪</span> Log-out</Link></li>
          </ul>

        </div>
      </nav>

      <main className="profile-main-content">
        <h1>{isFarmer ? 'Farmer Account Settings' : 'Account Settings'}</h1>

        <div className="profile-picture-container">
          <img
            src={formData.profileImage}
            alt="Profile"
            className="profile-picture"
          />
        </div>

        <form onSubmit={handleSaveChanges}>
          <section className="profile-form-section">
            <h2>Personal Information</h2>
            <div className="profile-form-grid">
              <div className="profile-form-group">
                <label htmlFor="firstName">First name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="profile-form-group">
                <label htmlFor="lastName">Last name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="profile-form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="profile-form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </section>

          <section className="profile-form-section">
            <h2>Billing Address</h2>
            <div className="profile-form-grid">
              <div className="profile-form-group">
                <label htmlFor="street">Street Address</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                />
              </div>
              <div className="profile-form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div className="profile-form-group">
                <label htmlFor="postalCode">Postal Code</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                />
              </div>
              <div className="profile-form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>
              <div className="profile-form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </section>
          <button type="submit" className="profile-btn-save">Save Changes</button>
        </form>
      </main>
    </div>
  );
};

export default Profile;
