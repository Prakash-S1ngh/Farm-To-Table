import React, { useContext } from 'react';
import { MinusIcon, PlusIcon, XIcon } from 'lucide-react';
import './Cart.css';
import Header from '../components/Header';
import { ProductContext } from '../ProductsCatalog/ProductContext'; // Import the context
import { Link } from 'react-router-dom';
import axios from 'axios';

const Cart = () => {
  // Access cart items and methods from ProductContext
  const { cartItems, removeFromCart, incrementQuantity, decrementQuantity } = useContext(ProductContext);

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Construct the order_details array
  const orderDetails = cartItems.map(item => ({
    product_id: item.product_id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    subtotal: item.price * item.quantity,
  }));

  // Function to handle payment and order creation
  const paymentHandler = async () => {
    try {
      // Prepare the data to send to the backend
      const cartData = {
        total_amount: calculateSubtotal(),
        order_details: orderDetails,
      };

      // Send a request to the server to create an order
      const res = await axios.post('http://localhost:4000/users/api/v2/orders', cartData, {
        withCredentials: true, // Send cookies for authentication if needed
      });

      // Log the response or handle the order creation success
      console.log("The order is placed:", res.data);

      // Redirect to a success page or update the UI
      window.location.href = '/Payment'; // Alternatively, use history.push if using react-router

    } catch (error) {
      // Handle errors
      console.error("Error placing order:", error);
      alert("Failed to place the order. Please try again.");
    }
  };

  return (
    <div>
      <Header />
      <div className="cart-container">
        <div className="cart-wrapper">
          <h1 className="cart-title">My Shopping Cart</h1>

          <div className="cart-content">
            <div className="cart-items">
              <div className="cart-headers">
                <span>PRODUCT</span>
                <span>PRICE</span>
                <span>QUANTITY</span>
                <span>SUBTOTAL</span>
                <span></span>
              </div>

              {/* Render cart items */}
              {cartItems.length > 0 ? (
                cartItems.map((item, index) => (
                  <div key={index} className="cart-item">
                    <div className="product-info">
                      <img src={item.prodImage} alt={item.name} className="product-image" />
                      <span className="product-name">{item.name}</span>
                    </div>
                    <div className="product-price">Rs {item.price}</div>
                    <div className="quantity-controls">
                      <button className="quantity-btn" onClick={() => decrementQuantity(item.product_id)}>
                        <MinusIcon size={16} />
                      </button>
                      <input type="text" value={item.quantity} className="quantity-input" readOnly />
                      <button className="quantity-btn" onClick={() => incrementQuantity(item.product_id)}>
                        <PlusIcon size={16} />
                      </button>
                    </div>
                    <div className="subtotal">Rs {(item.price * item.quantity)}</div>
                    <button className="remove-btn" onClick={() => removeFromCart(item.product_id)}>
                      <XIcon size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <p>Your cart is empty.</p>
              )}
            </div>

            <div className="cart-summary">
              <h2>Cart Total</h2>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>Rs {calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>Rs {calculateSubtotal().toFixed(2)}</span>
              </div>
              <button className="checkout-btn" onClick={paymentHandler}>
                <Link to="/Payment">Proceed to checkout</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
