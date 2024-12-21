import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './Profile.css';
import userProfileImage from './images/UserPro.jpg';
import UserContext from './Context/UserContext';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const { isFarmer, isUser, setUser, setFarmer, loggedin, setLoggedin } = useContext(UserContext);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    country: '',
    profileImage: ''
  });
  const [loading, setLoading] = useState(true);

  const logoutHandler = () => {
    if (isUser) {
      setLoggedin(false);
      setUser(false);
    }
    if (isFarmer) {
      setLoggedin(false);
      setFarmer(false);
    }
  };

  // Fetch user data from API
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/users/api/v2/GetUser', {
        withCredentials: true,
      });
      setUserData(response.data.user);

      const { first_name, last_name, email, phone, profile_image, street,state , country, postal_code , city } = response.data.user;
      setFormData({
        firstName: first_name || '',
        lastName: last_name || '',
        email: email || '',
        phone: phone || '',
        street: street || '',
        city: city || '',
        postalCode: postal_code || '',
        country: country || '',
        state: state || '',
        profileImage: profile_image || userProfileImage,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch farmer data from API
  const fetchFarmerData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/farmers/api/v2/getFarmer', {
        withCredentials: true,
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
        profileImage: response.data.farmer.profile_image || response.data.farmer.profileImage || null,
      });
    } catch (error) {
      console.error('Error fetching farmer data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFarmer) {
      fetchFarmerData();
    } else {
      fetchUserData();
    }
  }, []);

  // Handle Save Changes
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isFarmer
        ? 'http://localhost:4000/farmers/api/v2/farmAddress'
        : 'http://localhost:4000/users/api/v2/updateUser';

        console.log(formData);
      if(!isFarmer){
        await axios.post(url, formData, {
          withCredentials: true,
        });
      }
      else{
        await axios.post(url, {
          street: formData.street,
          city: formData.city,
          postal_code: formData.postalCode,
          country: formData.country,
          state: formData.state,
        }, {
        withCredentials: true,
      });
      }

      // Re-fetch data to re-render
      if (isFarmer) {
        await fetchFarmerData();
      } else {
        await fetchUserData();
      }
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to update the address
  const updateAddress = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const addressUrl = isFarmer
        ? 'http://localhost:4000/farmers/api/v2/farmAddress'
        : 'http://localhost:4000/users/api/v2/updateUser';


      // Make the POST request to update the address
      if(!isFarmer){
        await axios.post(addressUrl, {
          street: formData.street,
          city: formData.city,
          postal_code: formData.postalCode,
          country: formData.country,
          state: formData.state,
        }, {
        withCredentials: true,
      });
    }
    else{
      await axios.post(addressUrl, {
        street: formData.street,
        city: formData.city,
        postal_code: formData.postalCode,
        country: formData.country,
        state: formData.state,
      }, {
      withCredentials: true,
    });
    }
      
      // Re-fetch data to reflect the updated address
      if (isFarmer) {
        await fetchFarmerData();
      } else {
        await fetchUserData();
      }
    } catch (error) {
      console.error('Error updating address:', error);
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
          <li><Link to='/'>Home</Link></li>
            <li><Link to='/UserProfile'> <span className="nav-icon">📊</span> Dashboard</Link></li>
            {!isFarmer && (
              <>
                <li><Link to='/ordersHistory'><span className="nav-icon">📜</span> Order History</Link></li>
                <li><Link to='/Wishlist'><span className="nav-icon">❤️</span> Wishlist</Link></li>
                <li><Link to='/Cart'><span className="nav-icon">🛒</span> Shopping Cart</Link></li>
              </>
            )}
            {isFarmer && (
              <>
              
              <li><a href="/FarmProducts"><span className="nav-icon">📜</span> Farm Orders</a></li>
              </>
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
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
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
            </div>
          </section>

          <button type="submit" className="profile-submit-button">Save Changes</button>
        </form>

        {/* <form onSubmit={updateAddress}>
          <button type="submit" className="profile-update-address-button">Update Address</button>
        </form> */}
      </main>
    </div>
  );
};

export default Profile;
