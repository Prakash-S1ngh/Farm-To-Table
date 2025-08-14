import React, { useContext, useEffect, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import { ProductContext } from '../ProductsCatalog/ProductContext';

const Cart = () => {
  const {
    cartItems, // New items in context
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    setCartItems,
  } = useContext(ProductContext);

  const [currentItems, setCurrentItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFetched, setIsFetched] = useState(false);

  // 1️⃣ FETCH EXISTING CART ITEMS
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:4000/users/api/v2/getcart', {
        withCredentials: true,
      }); 
      setCurrentItems(res.data.cartItems);
      console.log('Fetched cart items from server:', res.data.cartItems);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setIsFetched(true);
    }
  };
  
  useEffect(() => {
    if (!isFetched) {
      fetchCart();
    }
  }, [isFetched]);

  // 2️⃣ SYNC CONTEXT NEW ITEMS TO SERVER
  useEffect(() => {
    const createNewItems = async () => {
      if (!isFetched || cartItems.length === 0) return;

      try {
        for (const item of cartItems) {
          console.log("Creating cart for new item:", item);
          
          await axios.post(
            'http://localhost:4000/users/api/v2/createcart',
            {
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              prodImage: item.prodImage,
            },
            { withCredentials: true }
          );
        }
      } catch (error) {
        console.error("Error creating cart:", error);
      } finally {
        // After creating new items, refetch cart
        await fetchCart();
        // Clear cartItems context as it's now saved
        setCartItems([]);
      }
    };
    createNewItems();
  }, [cartItems, isFetched]);

  const handleUpdateQuantity = async (name, quantity, price) => {
    try {
      await axios.patch(
        'http://localhost:4000/users/api/v2/updateCart',
        { name, quantity, price },
        { withCredentials: true }
      );
      await fetchCart();
    } catch (error) {
      console.error(error);
      alert('Error updating cart quantity!');
    }
  };
  
  const handleDecrement = async (item) => {
    if (item.quantity > 1) {
      decrementQuantity(item.name);
      await handleUpdateQuantity(item.name, item.quantity - 1, item.price);
    } else {
      await handleDeleteItem(item.name);
    }
  };
  
  const handleIncrement = async (item) => {
    incrementQuantity(item.name);
    await handleUpdateQuantity(item.name, item.quantity + 1, item.price);
  };
  
  const handleDeleteItem = async (name) => {
    try {
      await axios.delete(`http://localhost:4000/users/api/v2/deletecart/${name}`, {
        withCredentials: true,
      });
      await fetchCart();
      removeFromCart(name);
    } catch (error) {
      console.error(error);
      alert('Error removing item from cart!');
    }
  };
  
  const calculateSubtotal = () =>
    currentItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const orderDetails = currentItems.map((item) => ({
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    subtotal: item.price * item.quantity,
  }));

  const paymentHandler = async () => {
    try {
      if (currentItems.length === 0) {
        alert('Your cart is empty!');
        return;
      }

      const cartData = {
        total_amount: calculateSubtotal(),
        order_details: orderDetails,
      };

      console.log('Placing order with data:', cartData);

      // Create the order
      const orderResponse = await axios.post('http://localhost:4000/users/api/v2/orders', cartData, {
        withCredentials: true,
      });

      console.log('Order placed successfully:', orderResponse.data);

      if (orderResponse.data.success) {
        // Clear cart context
        setCartItems([]);
        
        // Clear server cart
        await axios.delete('http://localhost:4000/users/api/v2/clear-cart', {
          withCredentials: true,
        });

        // Fetch updated cart
        await fetchCart();

        // Store order details in localStorage for payment page
        localStorage.setItem('currentOrder', JSON.stringify({
          orderId: orderResponse.data.orderId,
          totalAmount: cartData.total_amount,
          orderDetails: cartData.order_details
        }));

        // Redirect to payment page
        window.location.href = '/Payment';
      } else {
        alert('Failed to place order: ' + orderResponse.data.message);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place the order. Please try again.');
    }
  };
  
  const combinedItems = [...currentItems, ...cartItems]; // Will only be context new items until saved

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="max-w-6xl w-full mx-auto p-4 bg-white rounded shadow">
        <h1 className="text-2xl font-bold text-center my-6">My Shopping Cart</h1>
        {loading ? (
          <div className="text-center mt-20 text-gray-500">Loading your cart...</div>
        ) : combinedItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-[3fr_1fr_2fr_1fr_40px] font-bold text-gray-600 border-b border-gray-300 pb-3 hidden md:grid">
                <span>Product</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Subtotal</span>
                <span></span>
              </div>
              {combinedItems.map((item) => (
                <div
                  key={item.name}
                  className="grid grid-cols-1 md:grid-cols-[3fr_1fr_2fr_1fr_40px] items-center gap-3 border-b border-gray-100 py-4 relative"
                >
                  <div className="flex items-center space-x-3">
                    <img src={item.prodImage} alt={item.name} className="w-20 h-20 object-cover rounded" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <span className="text-gray-600">Rs {item.price}</span>
                  <div className="flex items-center space-x-3">
                    <button
                      className="bg-gray-100 p-2 rounded hover:bg-gray-200"
                      onClick={() => handleDecrement(item)}
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="text"
                      value={item.quantity}
                      readOnly
                      className="w-12 text-center border rounded"
                    />
                    <button
                      className="bg-gray-100 p-2 rounded hover:bg-gray-200"
                      onClick={() => handleIncrement(item)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="font-medium">Rs {item.price * item.quantity}</span>
                  <button
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDeleteItem(item.name)}
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded p-4 space-y-4">
              <h2 className="text-xl font-semibold">Cart Totals</h2>
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rs {calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-3 border-t">
                <span>Total:</span>
                <span>Rs {calculateSubtotal().toFixed(2)}</span>
              </div>
              <button
                className="w-full rounded bg-green-500 hover:bg-green-600 text-white py-3 mt-4 font-bold"
                onClick={paymentHandler}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center mt-20">
            <h2 className="text-2xl font-semibold">Your cart is empty</h2>
            <p className="text-gray-600 mt-2">Looks like you haven’t added any products yet.</p>
            <Link
              to="/shop"
              className="inline-block mt-4 rounded bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 font-bold"
            >
              Go to Shop
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;