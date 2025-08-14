import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { ProductContext } from '../ProductsCatalog/ProductContext';
import { Package, Calendar, DollarSign, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(ProductContext);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:4000/users/api/v2/orders', {
        withCredentials: true
      });

      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Orders</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchOrders}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
            <p className="text-gray-600 mt-2">Track all your previous orders and their status</p>
          </div>

          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order.order_id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Package className="w-6 h-6 text-green-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.order_id}
                        </h3>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status}</span>
                        </div>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">
                          {new Date(order.order_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600 font-medium">
                          ₹{order.total_amount}
                        </span>
                      </div>
                      <div className="text-gray-600">
                        {order.details?.length || 0} items
                      </div>
                    </div>

                    <button
                      onClick={() => toggleOrderDetails(order.order_id)}
                      className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
                    >
                      {expandedOrder === order.order_id ? 'Hide Details' : 'View Details'}
                    </button>

                    {expandedOrder === order.order_id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-3">Order Details:</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Product
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Quantity
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Price
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Subtotal
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {order.details?.map((detail, index) => (
                                <tr key={index}>
                                  <td className="px-3 py-2 whitespace-nowrap">
                                    <div className="flex items-center space-x-3">
                                      {detail.prodImage && (
                                        <img 
                                          src={detail.prodImage} 
                                          alt={detail.name} 
                                          className="w-10 h-10 rounded object-cover"
                                        />
                                      )}
                                      <span className="text-sm font-medium text-gray-900">
                                        {detail.name}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                    {detail.quantity}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                    ₹{detail.price}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                    ₹{detail.quantity * detail.price}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-6">Start shopping to see your order history here.</p>
              <button
                onClick={() => window.location.href = '/shop'}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrderHistory;
