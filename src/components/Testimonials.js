
import React from 'react';


const Testimonial = ({ text, author, rating }) => {
    return (
      <div className="testimonial">
        {/* Display the testimonial text */}
        <p>{text}</p>
        {/* Display the author's name */}
        <p className="author">- {author}</p>
        {/* Display the rating */}
        <div className="rating">
          {Array.from({ length: 5 }, (_, index) => (
            <span key={index} className={index < rating ? 'star filled' : 'star'}>★</span>
          ))}
        </div>
      </div>
    );
};

export default Testimonial;

