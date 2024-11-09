import React from 'react';
import { Heart, ShoppingCart, User, Clock } from 'lucide-react';


const CategoryCard = ({ name, image }) => {
    return (
      <div className="category-card">
        <img src={image} alt={name} />
        <p>{name}</p>
      </div>
    );
  };
  export default CategoryCard;