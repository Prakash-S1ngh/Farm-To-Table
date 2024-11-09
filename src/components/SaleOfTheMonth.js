
import React from 'react';
import { Heart, ShoppingCart, User, Clock } from 'lucide-react';

const SaleOfTheMonth = () => {
    return (
      <div className="sale-of-month">
        <h3>BEST DEALS</h3>
        <h2>Sale of the Month</h2>
        <div className="countdown">
          <div className="time-unit">
            <span className="number">00</span>
            <span className="label">DAYS</span>
          </div>
          <div className="time-unit">
            <span className="number">02</span>
            <span className="label">HOURS</span>
          </div>
          <div className="time-unit">
            <span className="number">18</span>
            <span className="label">MINS</span>
          </div>
          <div className="time-unit">
            <span className="number">46</span>
            <span className="label">SECS</span>
          </div>
        </div>
        <button className="shop-now">Shop Now <Clock /></button>
      </div>
    );
  };
  export default SaleOfTheMonth;