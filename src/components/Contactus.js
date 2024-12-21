import React, { useState } from 'react';
import './ContactUs.css'; // Import the CSS file
import Header from './Header';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
    alert('Form submitted!');
  };

  return (
    <>
        <Header/>

    <div className="contact-us">
        
      <div className="contact-us-image">
        <img src="http://isinglassinc.com/wp-content/uploads/2015/01/farm_to_table_logo-1024x626.jpg" alt="Contact Us" />
      </div>
      <div className="contact-us-form">
        <h2>Contact Us</h2> 
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
    </>
  );
};

export default ContactUs;