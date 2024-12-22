import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  DollarSign,
  Tractor
} from 'lucide-react';
import './Dashboard.css';
import { LineChart , PieChart, Pie, Cell, ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [data, setData] = useState({
    profits: null,
    totalProducts: null,
    totalOrders: null,
    totalCustomers: null,
    change: null
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // To control modal visibility
  const [currentChartType, setCurrentChartType] = useState(''); // To determine which chart to show in modal

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Fetch Recent Orders
  const fetchRecentOrders = async () => {
    try {
      const response = await axios.get('http://localhost:4000/adminpanel/api/v2/getRecent', {
        withCredentials: true
      });
      setRecentOrders(response.data.recentOrders);
    } catch (error) {
      console.error("Error fetching recent orders:", error);
    }
  };

  const fetchTotalCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/adminpanel/api/v2/gettotalCustomer', {
        withCredentials: true
      });

      const { totalCustomers } = response.data;

      setData(prevState => ({ ...prevState, totalCustomers }));

    } catch (error) {
      console.error("Error fetching total customers:", error);
    }
  };

  const fetchProfitData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/adminpanel/api/v2/getProfits', {
        withCredentials: true
      });

      const { current_month_total_sum, previous_month_total_sum, profit_ratio, total_sum_of_all_products } = response.data;

      setData(prevState => ({
        ...prevState,
        profits: total_sum_of_all_products,
        change: profit_ratio

      }));

    } catch (error) {
      console.error("Error fetching profit data:", error);
    }
  };

  const fetchTotalOrders = async () => {
    try {
      const response = await axios.get('http://localhost:4000/adminpanel/api/v2/gettotaloders', {
        withCredentials: true
      });
      const result = await axios.get('http://localhost:4000/adminpanel/api/v2/gettotalitems', {
        withCredentials: true
      });

      const { totalOrders } = response.data;
      const { totalProducts } = result.data;

      setData(prevState => ({
        ...prevState,
        totalOrders,
        totalProducts: totalProducts
      }));

    } catch (error) {
      console.error("Error fetching total orders:", error);
    }
  };

  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);


  // Fetch Monthly Sales Data
  const fetchSalesData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/adminpanel/api/v2/getSales');
      setSalesData(response.data);  // Assuming response.data is an array of sales data
      console.log("sales distribution", salesData);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };
  const fetchCategoryData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/adminpanel/api/v2/getProd');
      setCategoryData(response.data);  // Assuming response.data is an array for product categories
      console.log("product distribution", categoryData[1]);
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };
  // const categoryData = [
  //   { "category_id": "CAT5", "category_name": "Dairy", "product_count": 8 },
  //   { "category_id": "CAT1", "category_name": "Fruits", "product_count": 14 },
  //   { "category_id": "CAT6", "category_name": "Other", "product_count": 8 },
  //   { "category_id": "CAT4", "category_name": "Special", "product_count": 8 },
  //   { "category_id": "CAT3", "category_name": "Spices", "product_count": 11 },
  //   { "category_id": "CAT2", "category_name": "Vegetables", "product_count": 10 }
  // ];

  // const salesData = [
  //   { "order_date": "2024-11-07T18:30:00.000Z", "daily_sales": "1236.00", "orders_count": 3 },
  //   { "order_date": "2024-11-08T18:30:00.000Z", "daily_sales": "3320.00", "orders_count": 2 },
  //   { "order_date": "2024-11-09T18:30:00.000Z", "daily_sales": "638.00", "orders_count": 5 },
  //   { "order_date": "2024-11-10T18:30:00.000Z", "daily_sales": "2776.00", "orders_count": 2 },
  //   { "order_date": "2024-11-11T18:30:00.000Z", "daily_sales": "2142.30", "orders_count": 4 },
  //   { "order_date": "2024-11-12T18:30:00.000Z", "daily_sales": "2844.76", "orders_count": 3 }
  // ];

  // Open Modal Function
  const openModal = (chartType) => {
    setCurrentChartType(chartType);
    setIsModalOpen(true);
  };

  // Close Modal Function
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentChartType('');
  };

  useEffect(() => {
    fetchRecentOrders();
    fetchTotalCustomers();
    fetchProfitData();
    fetchTotalOrders();
    fetchSalesData();
    fetchCategoryData();


  }, []);

  return (
    <div className="dashboard-container">
      {/* Key Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-content">
            <div className="metric-icon-wrapper">
              <DollarSign className="metric-icon green-icon" />
            </div>
            <div className="metric-details">
              <p className="metric-title">Total Revenue</p>
              <h3 className="metric-value">₹{data.profits ? data.profits : 'Loading...'}</h3>
              <p className="metric-change">`+{data.change}% this month`</p>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-content">
            <div className="metric-icon-wrapper">
              <ShoppingCart className="metric-icon blue-icon" />
            </div>
            <div className="metric-details">
              <p className="metric-title">Total Orders</p>
              <h3 className="metric-value">{data.totalOrders ? data.totalOrders : 'Loading...'}</h3>
              <p className="metric-change">+15.3% this month</p>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-content">
            <div className="metric-icon-wrapper">
              <Users className="metric-icon purple-icon" />
            </div>
            <div className="metric-details">
              <p className="metric-title">total Customers</p>
              <h3 className="metric-value">{data.totalCustomers ? data.totalCustomers : 'Loading...'}</h3>
              <p className="metric-change">+8.7% this month</p>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-content">
            <div className="metric-icon-wrapper">
              <Tractor className="metric-icon orange-icon" />
            </div>
            <div className="metric-details">
              <p className="metric-title">Product Listings</p>
              <h3 className="metric-value">{data.totalProducts ? data.totalProducts : 'Loading...'}</h3>
              <p className="metric-change">+5.2% this month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sales and Product Category Analysis */}
      {/* Sales and Category Analysis */}
      <div className="charts-grid">
        {/* Monthly Sales Chart */}
        <div className="chart-card" onClick={() => openModal('sales')}>
          <div className="chart-header">
            <h2>Monthly Sales Trends</h2>
          </div>
          <div className="chart-content">
            {salesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <ComposedChart data={salesData}>
                  <XAxis dataKey="order_date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <CartesianGrid stroke="#f5f5f5" />
                  <Bar dataKey="daily_sales" barSize={20} fill="#413ea0" />
                  <Line type="monotone" dataKey="orders_count" stroke="#ff7300" />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <p>Loading sales data...</p>
            )}
          </div>
        </div>

        {/* Product Category Distribution */}
        <div className="chart-card" onClick={() => openModal('category')}>
          <div className="chart-header">
            <h2>Product Category Distribution</h2>
          </div>
          <div className="chart-content">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={categoryData}>
                  <XAxis dataKey="category_name" />
                  <YAxis />
                  <Tooltip />
                  <CartesianGrid stroke="#f5f5f5" />
                  <Line type="monotone" dataKey="product_count" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p>Loading category data...</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={closeModal}>×</button>
            {currentChartType === 'sales' && salesData.length > 0 && (
              <div className="modal-chart">
                <h2>Monthly Sales Trends - Full View</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={salesData}>
                    <XAxis dataKey="order_date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <CartesianGrid stroke="#f5f5f5" />
                    <Bar dataKey="daily_sales" barSize={20} fill="#413ea0" />
                    <Line type="monotone" dataKey="orders_count" stroke="#ff7300" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            )}
            {currentChartType === 'category' && categoryData.length > 0 && (
              <div className="modal-chart">
                <h2>Product Category Distribution - Full View</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={categoryData}>
                    <XAxis dataKey="category_name" />
                    <YAxis />
                    <Tooltip />
                    <CartesianGrid stroke="#f5f5f5" />
                    <Line type="monotone" dataKey="product_count" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      )}


      {/* Recent Orders */}
      <div className="orders-card">
        <div className="orders-header">
          <h2>Recent Orders</h2>
        </div>
        <div className="orders-content">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
                <tr key={index}>
                  <td>{order.customer_id}</td>
                  <td>{order.first_name} {order.last_name}</td>
                  <td>{order.order_count} orders</td>
                  <td className="order-total">₹{order.total_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
