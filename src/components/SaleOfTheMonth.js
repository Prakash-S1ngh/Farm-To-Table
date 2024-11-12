import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const SaleOfTheMonth = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Set the sale end date and time
  const saleEndTime = new Date("2024-12-01T23:59:59").getTime();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const timeRemaining = saleEndTime - now;

      if (timeRemaining > 0) {
        setTimeLeft({
          days: Math.floor(timeRemaining / (1000 * 60 * 60 * 24)),
          hours: Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((timeRemaining % (1000 * 60)) / 1000)
        });
      } else {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    // Clear the interval on component unmount
    return () => clearInterval(timer);
  }, [saleEndTime]);

  return (
    <div className="sale-of-month">
      <h3>BEST DEALS</h3>
      <h2>Sale of the Month</h2>
      <div className="countdown">
        <div className="time-unit">
          <span className="number">{String(timeLeft.days).padStart(2, '0')}</span>
          <span className="label">DAYS</span>
        </div>
        <div className="time-unit">
          <span className="number">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="label">HOURS</span>
        </div>
        <div className="time-unit">
          <span className="number">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="label">MINS</span>
        </div>
        <div className="time-unit">
          <span className="number">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="label">SECS</span>
        </div>
      </div>
      <button className="shop-now">Shop Now <Clock /></button>
    </div>
  );
};

export default SaleOfTheMonth;