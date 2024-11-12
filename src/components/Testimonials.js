import React, { useState } from 'react';
import './Testimonials.css';
import Header from './Header';

const Testimonials = () => {
    const [selectedProduct, setSelectedProduct] = useState('Tomato');

    const testimonialsData = [
        {
            content: "The tomatoes are always fresh and taste amazing in salads!",
            author: "Priya Verma",
            role: "Chef",
            rating: 5,
            product: "Tomato"
        },
        {
            content: "Good quality but slightly overripe on arrival.",
            author: "Mansi Mahale",
            role: "Home Cook",
            rating: 4,
            product: "Tomato"
        },
        {
            content: "Perfectly fresh coriander that lasted long!",
            author: "Tisha Maheshwari",
            role: "Gardener",
            rating: 5,
            product: "Coriander"
        },
        {
            content: "Great for garnishing, though could be a bit fresher.",
            author: "Priya Sharma",
            role: "Food Blogger",
            rating: 4,
            product: "Coriander"
        },
        {
            content: "Best watermelon I’ve ever had! Super juicy and sweet.",
            author: "Shruti Gupta",
            role: "Health Enthusiast",
            rating: 5,
            product: "Watermelon"
        },
        {
            content: "Nice flavor but some pieces were less juicy.",
            author: "Aditya Dixit",
            role: "Parent",
            rating: 3,
            product: "Watermelon"
        },
        {
            content: "Mangoes were ripe, delicious, and perfect for smoothies!",
            author: "Akash Verma",
            role: "Food Blogger",
            rating: 5,
            product: "Mango"
        },
        {
            content: "Very tasty but smaller than expected.",
            author: "Pradeep Patidar",
            role: "Teacher",
            rating: 4,
            product: "Mango"
        },
        {
            content: "Fresh and crunchy cauliflower, great quality!",
            author: "Sumita Goel",
            role: "Fitness Coach",
            rating: 5,
            product: "Cauliflower"
        },
        {
            content: "Good, but the size could be bigger.",
            author: "Krishna Birla",
            role: "Home Chef",
            rating: 3,
            product: "Cauliflower"
        },
        {
            content: "Apples were crisp, sweet, and so fresh!",
            author: "Kanak Shukla",
            role: "Nutritionist",
            rating: 5,
            product: "Apple"
        },
        {
            content: "A bit more tart than I expected, but overall good.",
            author: "Parth Gupta",
            role: "Student",
            rating: 4,
            product: "Apple"
        },
        {
            content: "Bananas were perfectly ripe and full of flavor.",
            author: "Prakash Raj",
            role: "Yoga Instructor",
            rating: 5,
            product: "Banana"
        },
        {
            content: "They went brown quickly, but initially very tasty.",
            author: "Nora Fatehi",
            role: "Parent",
            rating: 3,
            product: "Banana"
        },
        {
            content: "Oranges were juicy and had a great balance of sweetness.",
            author: "Preeti Gautam",
            role: "Teacher",
            rating: 5,
            product: "Orange"
        },
        {
            content: "Some were a bit sour, but overall good quality.",
            author: "Salman Khan",
            role: "Student",
            rating: 4,
            product: "Orange"
        },
        {
            content: "The lettuce was fresh and crispy, perfect for salads!",
            author: "Khush Jaiswal",
            role: "Chef",
            rating: 5,
            product: "Lettuce"
        },
        {
            content: "It was okay, but I noticed some brown spots.",
            author: "Kishu Gupta",
            role: "Gardener",
            rating: 3,
            product: "Lettuce"
        },
        {
            content: "Best carrots I’ve had in a while, sweet and fresh!",
            author: "Rohit Vishwakarma",
            role: "Nutritionist",
            rating: 5,
            product: "Carrot"
        },
        {
            content: "Good quality but slightly dry.",
            author: "Karan Aujla",
            role: "Parent",
            rating: 4,
            product: "Carrot"
        },
        {
            content: "Perfectly ripe grapes, so sweet and juicy.",
            author: "Uma Soni",
            role: "Food Critic",
            rating: 5,
            product: "Grape"
        },
        {
            content: "They were good but could be fresher.",
            author: "Renuka Tripathi",
            role: "Teacher",
            rating: 3,
            product: "Grape"
        },
        {
            content: "The spinach was fresh and bright green, excellent quality!",
            author: "Mony Roy",
            role: "Health Coach",
            rating: 5,
            product: "Spinach"
        },
        {
            content: "It was decent, though some leaves were wilted.",
            author: "Kashish Thakur",
            role: "Student",
            rating: 3,
            product: "Spinach"
             
        },
    ];

    const handleProductChange = (event) => {
        setSelectedProduct(event.target.value);
    };

    const filteredTestimonials = testimonialsData.filter(
        (testimonial) => testimonial.product === selectedProduct
    );

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>★</span>
        ));
    };
    

    return (
      <>
      {/* <Header/> */}
        <div className="testimonials-container">
            <h2 className="testimonial-title">Customer Reviews</h2>

            {/* Product selection dropdown */}
            <div className="product-selection">
                <label htmlFor="product-select">Select Product:</label>
                <select id="product-select" value={selectedProduct} onChange={handleProductChange}>
                    <option value="Tomato">Tomato</option>
                    <option value="Coriander">Coriander</option>
                    <option value="Watermelon">Watermelon</option>
                    <option value="Mango">Mango</option>
                    <option value="Cauliflower">Cauliflower</option>
                    <option value="Apple">Apple</option>
                    <option value="Banana">Banana</option>
                    <option value="Orange">Orange</option>
                    <option value="Lettuce">Lettuce</option>
                    <option value="Carrot">Carrot</option>
                    <option value="Grape">Grape</option>
                    <option value="Spinach">Spinach</option>
                </select>
            </div>

            {/* Testimonials grid */}
            <div className="testimonials">
                {filteredTestimonials.map((testimonial, index) => (
                    <div className="testimonial-card" key={index}>
                        <p className="testimonial-content">"{testimonial.content}"</p>
                        <div className="testimonial-rating">{renderStars(testimonial.rating)}</div>
                        <div className="testimonial-author">{testimonial.author}</div>
                        <div className="testimonial-role">{testimonial.role}</div>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
};

export default Testimonials;