import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import './ProductCard.css'; // Make sure to create this CSS file for styling

const ProductCard = ({ name, price, prodImage, addToCart, addToWishlist }) => {
  return (
    <div className="product-card">
      <img src={prodImage} alt={name} className="prodImage" />
      <h3 className="product-name">{name}</h3>
      <p className="product-price">₹{price}</p>
      <div className="product-actions">
      </div>
    </div>
  );
};

export default ProductCard;
