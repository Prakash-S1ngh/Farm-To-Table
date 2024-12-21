import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AddItems.css';

const AddItems = () => {
  const [farmersRequests, setFarmersRequests] = useState([]);
  const [expandedProducts, setExpandedProducts] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // For handling the loading state

  useEffect(() => {
    const fetchFarmersRequests = async () => {
      try {
        const response = await axios.get('http://localhost:4000/adminpanel/api/v2/AddItems'); // Replace with your backend endpoint
        setFarmersRequests(response.data);
      } catch (err) {
        console.error('Error fetching farmers requests:', err);
        setError('Failed to load farmers requests. Please try again later.');
      }
    };

    fetchFarmersRequests();
  }, []);

  const toggleProducts = (farmerId) => {
    setExpandedProducts(expandedProducts === farmerId ? null : farmerId);
  };

  const handleDelete = (requestId) => {
    console.log('Deleted request:', requestId);
  };

  const handleApprove = async (farmerId, products) => {
  
    setLoading(true); // Show the loading spinner when starting the approval process
    try {
      const farmProductsIds = products.map(product => product.id); // Extract the product IDs
      console.log("Id of farmer",farmerId);
      // Send approval request to the backend
      const response = await axios.post('http://localhost:4000/adminpanel/api/v2/approve', {
        farmer_id: farmerId
      });

      if (response.status === 200) {
        // Handle success, e.g., show success message or update the state
        console.log('Products approved:', response.data);
        // Optionally update the state to reflect the approved status (e.g., updating status in UI)
      } else {
        console.error('Approval failed:', response.data);
        setError('Failed to approve products.');
      }
    } catch (err) {
      console.error('Error approving products:', err);
      setError('Failed to approve products. Please try again later.');
    } finally {
      setLoading(false); // Hide the loading spinner after the request completes
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="add-items-container">
      {farmersRequests.map(({ farmerId, products }) => {
        // Calculate totals
        const totalQuantity = products.reduce((sum, product) => sum + parseFloat(product.quantity || 0), 0);
        const totalPrice = products.reduce((sum, product) => sum + parseFloat(product.price || 0)*parseFloat(product.quantity || 0), 0);

        return (
          <div className="farmer-row" key={farmerId}>
            <div className="farmer-header">
              <span>Farmer ID: {farmerId}</span>
              <div className="actions">
                <button className="approve-button" onClick={() => handleApprove(farmerId, products)}>
                  {loading ? 'Approving...' : 'Approve'}
                </button>
                <button className="delete-button" onClick={() => handleDelete(farmerId)}>Delete</button>
                <button
                  className="show-products-button"
                  onClick={() => toggleProducts(farmerId)}
                >
                  {expandedProducts === farmerId ? 'Hide Products' : 'Show Products'}
                </button>
              </div>
            </div>
            {expandedProducts === farmerId && (
              <div className="products-table">
                <table>
                  <thead>
                    <tr>
                      <th className="table-header">Product Name</th>
                      <th className="table-header">Price</th>
                      <th className="table-header">Quantity</th>
                      <th className="table-header">Supplied On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.product_name}</td>
                        <td>Rs {product.price}</td>
                        <td>{product.quantity}</td>
                        <td>{product.date_added}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="totals-section">
                  <p>Total Quantity: {totalQuantity.toFixed(2)}</p>
                  <p>Total Price: Rs {totalPrice.toFixed(2)}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AddItems;
