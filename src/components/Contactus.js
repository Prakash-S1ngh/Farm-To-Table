import React, { useState, useContext } from 'react';
import './ContactUs.css'; // Import the CSS file
import Header from './Header';
import  UserContext  from '../Users/Context/UserContext';

const ContactUs = () => {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    user_type: user ? (user.role === 'farmer' ? 'farmer' : 'customer') : 'guest',
    subject: 'General Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('http://localhost:5000/contact/api/v2/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus({ type: 'success', message: data.message });
        // Reset form after successful submission
        setFormData({
          name: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || '',
          user_type: user ? (user.role === 'farmer' ? 'farmer' : 'customer') : 'guest',
          subject: 'General Inquiry',
          message: ''
        });
      } else {
        setSubmitStatus({ type: 'error', message: data.message });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Failed to submit form. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
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
        
        {submitStatus && (
          <div className={`alert ${submitStatus.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {submitStatus.message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Optional"
          />
          
          <label htmlFor="user_type">I am a *</label>
          <select
            id="user_type"
            name="user_type"
            value={formData.user_type}
            onChange={handleChange}
            required
          >
            <option value="guest">Guest</option>
            <option value="customer">Customer</option>
            <option value="farmer">Farmer</option>
            <option value="admin">Admin</option>
          </select>
          
          <label htmlFor="subject">Subject *</label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          >
            <option value="General Inquiry">General Inquiry</option>
            <option value="Product Information">Product Information</option>
            <option value="Order Support">Order Support</option>
            <option value="Technical Issue">Technical Issue</option>
            <option value="Partnership">Partnership</option>
            <option value="Feedback">Feedback</option>
            <option value="Other">Other</option>
          </select>
          
          <label htmlFor="message">Message *</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="5"
            placeholder="Please describe your inquiry or concern..."
          />
          
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default ContactUs;