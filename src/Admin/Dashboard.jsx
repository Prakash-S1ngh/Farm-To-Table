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

const Dashboard = () => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [data, setData] = useState({
    profits: null,
    totalProducts:null ,
    totalOrders: null,
    totalCustomers: null,
    change:null 
  });

  const salesData = [
    { month: 'Jan', sales: 4000 },
    { month: 'Feb', sales: 3000 },
    { month: 'Mar', sales: 5000 },
    { month: 'Apr', sales: 4500 },
    { month: 'May', sales: 6000 },
    { month: 'Jun', sales: 5500 }
  ];

  const productCategoryData = [
    { name: 'Seeds', value: 400 },
    { name: 'Farm Tools', value: 300 },
    { name: 'Fertilizers', value: 300 },
    { name: 'Pesticides', value: 200 }
  ];

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

  useEffect(() => {
    fetchRecentOrders();
    fetchTotalCustomers();
    fetchProfitData();
    fetchTotalOrders();
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
      <div className="charts-grid">
        {/* Monthly Sales Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h2>Monthly Sales Trends</h2>
          </div>
          <div className="chart-content">
            <div className="sales-chart-placeholder">
              Sales Chart Placeholder
            </div>
          </div>
        </div>

        {/* Product Category Distribution */}
        <div className="chart-card">
          <div className="chart-header">
            <h2>Product Category Distribution</h2>
          </div>
          <div className="chart-content">
            <div className="pie-chart-placeholder">
              Product Category Chart Placeholder
            </div>
          </div>
        </div>
      </div>

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
