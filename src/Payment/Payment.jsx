import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import { ProductContext } from '../ProductsCatalog/ProductContext';

const Payment = () => {
  const navigate = useNavigate();
  const { user } = useContext(ProductContext);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get order details from localStorage
    const storedOrder = localStorage.getItem('currentOrder');
    if (!storedOrder) {
      setError('No order found. Please return to cart.');
      return;
    }

    try {
      const order = JSON.parse(storedOrder);
      setOrderDetails(order);
      initializePayment(order);
    } catch (err) {
      setError('Invalid order data. Please return to cart.');
    }
  }, []);

  const initializePayment = async (order) => {
    try {
      setLoading(true);
      
      // Create Razorpay order
      const paymentOrderResponse = await axios.post(
        'http://localhost:4000/payment/create-order',
        {
          amount: order.totalAmount,
          order_id: order.orderId,
          currency: 'INR'
        },
        { withCredentials: true }
      );

      if (!paymentOrderResponse.data.success) {
        throw new Error(paymentOrderResponse.data.message);
      }

      const razorpayOrder = paymentOrderResponse.data;

      // Initialize Razorpay
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_HERE', // Replace with your actual key
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Farm to Table',
        description: `Order ${order.orderId}`,
        order_id: razorpayOrder.orderId,
        handler: async (response) => {
          await handlePaymentSuccess(response, order);
        },
        prefill: {
          name: user?.first_name || 'Customer Name',
          email: user?.email || 'customer@example.com',
          contact: user?.phone || '9999999999'
        },
        theme: {
          color: '#10B981'
        },
        modal: {
          ondismiss: () => {
            setPaymentStatus('cancelled');
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error('Payment initialization error:', err);
      setError('Failed to initialize payment. Please try again.');
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (response, order) => {
    try {
      setLoading(true);
      
      // Verify payment with backend
      const verificationResponse = await axios.post(
        'http://localhost:4000/payment/verify',
        {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          order_id: order.orderId,
          customer_id: user?.customer_id,
          amount: order.totalAmount
        },
        { withCredentials: true }
      );

      if (verificationResponse.data.success) {
        setPaymentStatus('success');
        // Clear order from localStorage
        localStorage.removeItem('currentOrder');
      } else {
        setPaymentStatus('failed');
        setError(verificationResponse.data.message);
      }

    } catch (err) {
      console.error('Payment verification error:', err);
      setPaymentStatus('failed');
      setError('Payment verification failed. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setPaymentStatus(null);
    setError(null);
    if (orderDetails) {
      initializePayment(orderDetails);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleViewOrders = () => {
    navigate('/orders');
  };

  if (error && !orderDetails) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleBackToHome}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">Your order has been placed successfully.</p>
            <p className="text-sm text-gray-500 mb-6">Order ID: {orderDetails?.orderId}</p>
            <div className="space-x-4">
              <button
                onClick={handleViewOrders}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                View Orders
              </button>
              <button
                onClick={handleBackToHome}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-4">{error || 'Something went wrong with your payment.'}</p>
            <div className="space-x-4">
              <button
                onClick={handleRetry}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={handleBackToHome}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'cancelled') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Cancelled</h2>
            <p className="text-gray-600 mb-4">You cancelled the payment process.</p>
            <div className="space-x-4">
              <button
                onClick={handleRetry}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={handleBackToHome}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          {loading ? (
            <>
              <Loader2 className="w-16 h-16 text-green-500 mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Payment</h2>
              <p className="text-gray-600">Please wait while we redirect you to the payment gateway...</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Complete Your Payment</h2>
              <p className="text-gray-600 mb-4">Order Total: ₹{orderDetails?.totalAmount}</p>
              <p className="text-sm text-gray-500 mb-6">Order ID: {orderDetails?.orderId}</p>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">• Secure payment via Razorpay</p>
                <p className="text-sm text-gray-600">• Multiple payment options available</p>
                <p className="text-sm text-gray-600">• Instant order confirmation</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
