import React from 'react';
import './Payment.css'; // Import the CSS file
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const Payment = () => {
  return (
    <>
      <Header />
      <div className="payment-container">
        <div className="payment-content">
          <h1 className="payment-message">Order Successfully</h1>
          <Link to="/shop" className="shop-now-btn">
            Shop Now
          </Link>
        </div>
      </div>
    </>
  );
};

export default Payment;
