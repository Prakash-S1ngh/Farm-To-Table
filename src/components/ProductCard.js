import React from 'react';

const ProductCard = ({ name, price, prodImage }) => {
  return (
    <div className="w-60 p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col items-center">
      <img
        src={prodImage}
        alt={name}
        className="w-full h-44 object-cover rounded-xl mb-4"
      />
      <h3 className="text-lg font-semibold text-gray-800 mb-1 text-center">{name}</h3>
      <p className="text-gray-600 text-base mb-3">₹{price}</p>
    </div>
  );
};

export default ProductCard;