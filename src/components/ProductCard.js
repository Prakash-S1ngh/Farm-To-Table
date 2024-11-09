import React from 'react';
import { Heart, ShoppingCart, User } from 'lucide-react';


const ProductCard = ({ name, price, image }) => {
    return (
      <div className="product-card">
        <img src={image} alt={name} />
        <h3>{name}</h3>
        <p>₹{price}</p>
        <button>Add to Cart</button>
      </div>
    );
  };

  export default ProductCard;