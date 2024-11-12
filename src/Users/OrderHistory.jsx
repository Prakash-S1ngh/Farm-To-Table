import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserContext from './Context/UserContext';
import './OrderHistory.css';
import axios from 'axios';

const OrderHistory = () => {
  // Destructure context values from UserContext
  const { isFarmer, isUser, setUser, setFarmer, loggedin, setLoggedin } = useContext(UserContext);
  const [orders, setOrders] = useState([]);

  // Fetch orders from the server
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:4000/users/api/v2/getorders', {
          withCredentials: true,
        });
        setOrders(res.data.orders); // Assuming 'orders' is the key in the response data
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  // Handle logout functionality
  const logoutHandler = () => {
    setLoggedin(false);
    if (isUser) setUser(false);
    if (isFarmer) setFarmer(false);
  };

  return (
    <div className="profile-container">
      <nav className="profile-sidebar">
        <div className="profile-nav-content">
          <h2>Navigation</h2>
          <ul>
          <li><Link to='/UserProfile'> <span className="nav-icon">📊</span> Dashboard</Link></li>
            {!isFarmer && (
              <>
               <li><Link to='/ordersHistory'><span className="nav-icon">📜</span>Order History</Link></li>
               <li><Link to='/Wishlist'><span className="nav-icon">❤️</span> Wishlist</Link></li>
                <li><Link to='/Cart'><span className="nav-icon">🛒</span> Shopping Cart</Link></li>
              </>
            )}
            {isFarmer && (
              <li><a href="/FarmProducts"><span className="nav-icon">📜</span>Farm Orders</a></li>
            )}
            <li onClick={logoutHandler}><Link to="/"><span className="nav-icon">🚪</span> Log-out</Link></li>
          </ul>
        </div>
      </nav>

      <main className="profile-main-content">
        <h1>Orders Placed</h1>
        <div className="order-history">
          {orders.length > 0 ? (
            orders.map(order => (
              <div key={order.order_id} className="order-card">
                <h3>Order ID: {order.order_id}</h3>
                <p>Customer ID: {order.customer_id}</p>
                <p>Order Date: {new Date(order.order_date).toLocaleDateString()}</p>
                <p>Total Amount: Rs {order.total_amount}</p>
                <p>Status: {order.status}</p>
                <div className="order-details">
                  <h4>Order Details:</h4>
                  {order.details.map(detail => (
                    <div key={detail.order_detail_id} className="order-detail-item">
                      <p>Product ID: {detail.product_id}</p>
                      <p>Quantity: {detail.quantity}</p>
                      <p>Price: Rs {detail.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>No orders found.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrderHistory;
