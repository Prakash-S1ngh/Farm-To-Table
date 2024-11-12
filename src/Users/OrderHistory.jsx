import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserContext from './Context/UserContext';
import './OrderHistory.css';
import axios from 'axios';

const OrderHistory = () => {
  const { isFarmer, isUser, setUser, setFarmer, loggedin, setLoggedin } = useContext(UserContext);
  const [orders, setOrders] = useState([]);

  // Fetch orders from the server
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:4000/users/api/v2/getorders', {
          withCredentials: true,
        });
        setOrders(res.data.orders);
        console.log("orders " , orders);
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

  // Handle the toggle of order details
  const toggleOrderDetails = (orderId) => {
    const orderElement = document.getElementById(orderId);
    orderElement.classList.toggle('show-details');
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
              <div key={order.order_id} className="order-card" id={order.order_id}>
                <h3>Order ID: {order.order_id}</h3>
                <p>Customer ID: {order.customer_id}</p>
                <p>Order Date: {new Date(order.order_date).toLocaleDateString()}</p>
                <p>Total Amount: Rs {order.total_amount}</p>
                <p>Status: {order.status}</p>
                <button className="toggle-details-btn" onClick={() => toggleOrderDetails(order.order_id)}>
                  Order Details
                </button>
                <div className="order-details">
                  <h4>Order Details:</h4>
                  <table className="order-details-table">
                    <thead>
                      <tr>
                        <th>Product ID</th>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Image</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.details.map(detail => (
                        <tr key={detail.order_detail_id}>
                          <td>{detail.product_id}</td>
                          <td>{detail.name}</td>
                          <td>{detail.quantity}</td>
                          <td>{detail.price}</td>
                          <td><img src={detail.prodImage} alt={detail.product_name} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          ) : (
            <p>No orders placed yet.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrderHistory;
