import React, { useState } from 'react';
// import './FarmToTableItems.css';

const ShopByCategory = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const items = [
    { name: 'Fresh Vegetables', className: 'vegetables' },
    { name: 'Fresh Fruits', className: 'fruits' },
    { name: 'Exotic', className: 'grains' },
    { name: 'Dairy', className: 'dairy' },
    { name: 'Natural Supplements', className: 'supplements' },
    { name: 'Flowers & Plants', className: 'flowers' },
    { name: 'Mushrooms', className: 'mushrooms' },
  ];

  const itemsPerPage = 4; 
  const totalItems = items.length;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === totalItems - itemsPerPage ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalItems - itemsPerPage : prevIndex - 1
    );
  };

  return (
    <div className='con'>
      <h1>Shop By Top Categories</h1>
      <div className='carousel-container'>
        <button className='carousel-button prev' onClick={prevSlide}>
          &#10094;
        </button>
        <div className='carousel'>
          {items
            .slice(currentIndex, currentIndex + itemsPerPage)
            .map((item, index) => (
              <div key={index} className='farm-item'>
                <h3>{item.name}</h3>
                <div className={`farm-item-box ${item.className}`}></div>
              </div>
            ))}
        </div>
        <button className='carousel-button next' onClick={nextSlide}>
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default ShopByCategory;
