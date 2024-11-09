import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Signup.css'; // Import custom CSS for SignupForm

const SignupForm = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    pass: '',
    phone: '',
    image: null, // Add image field
  });

  const [farmerData, setFarmerData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    pass: '',
    phone: '',
    account_details: '',
    image: null, // Add image field for farmer
  });

  const [loading, setLoading] = useState(false); // Spinner state
  const [isUserSignup, setIsUserSignup] = useState(true); // Toggle between User and Farmer form

  const handleUserChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFarmerChange = (e) => {
    setFarmerData({ ...farmerData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e, isFarmer) => {
    if (isFarmer) {
      setFarmerData({ ...farmerData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); // Start spinner
      const url = isUserSignup
        ? 'http://localhost:4000/users/api/v2/createUser'
        : 'http://localhost:4000/farmers/api/v2/createFarmer';
      const data = isUserSignup ? formData : farmerData;

      // Prepare form data for image upload
      const formDataToSubmit = new FormData();
      for (const key in data) {
        formDataToSubmit.append(key, data[key]);
      }

      const res = await axios.post(url, formDataToSubmit, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(res);
      if (res.status === 200) window.location.href = '/login'; // Redirect on success
    } catch (error) {
      console.log("An error occurred in signup page", error);
    } finally {
      setLoading(false); // Stop spinner
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
        {loading && (
          <div className="spinner-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}

        <div className="bg-green-600 text-white text-center py-6">
          <h2 className="text-2xl font-bold">
            {isUserSignup ? 'Sign Up for Farm-to-Table' : 'Sign Up as a Farmer'}
          </h2>
          <div className="mt-4">
            <button
              onClick={() => setIsUserSignup(true)}
              className={`px-4 py-2 ${isUserSignup ? 'bg-green-700' : 'bg-green-500'} text-white rounded-l-md`}
            >
              User
            </button>
            <button
              onClick={() => setIsUserSignup(false)}
              className={`px-4 py-2 ${!isUserSignup ? 'bg-green-700' : 'bg-green-500'} text-white rounded-r-md`}
            >
              Farmer
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                id="firstName"
                name="first_name"
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={isUserSignup ? formData.first_name : farmerData.first_name}
                onChange={isUserSignup ? handleUserChange : handleFarmerChange}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                id="lastName"
                name="last_name"
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={isUserSignup ? formData.last_name : farmerData.last_name}
                onChange={isUserSignup ? handleUserChange : handleFarmerChange}
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={isUserSignup ? formData.email : farmerData.email}
              onChange={isUserSignup ? handleUserChange : handleFarmerChange}
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={isUserSignup ? formData.phone : farmerData.phone}
              onChange={isUserSignup ? handleUserChange : handleFarmerChange}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password"
              name="pass"
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={isUserSignup ? formData.pass : farmerData.pass}
              onChange={isUserSignup ? handleUserChange : handleFarmerChange}
            />
          </div>
          
          <div className="image-upload">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => handleImageChange(e, !isUserSignup)} // Check if farmer
              required
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
          >
            Sign Up
          </button>
        </form>
        <div className="bg-gray-50 px-4 py-6">
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
