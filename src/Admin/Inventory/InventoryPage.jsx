import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './InventoryPage.css';

const InventoryPage = () => {
  const [inventory, setInventory] = useState({});
  const [expandedSupplier, setExpandedSupplier] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get('http://localhost:4000/adminpanel/api/v2/Inventory'); // Replace with your backend endpoint
        setInventory(response.data);
      } catch (err) {
        console.error('Error fetching inventory:', err);
        setError('Failed to load inventory. Please try again later.');
      }
    };

    fetchInventory();
  }, []);

  const toggleSupplierProducts = (supplierId) => {
    setExpandedSupplier(expandedSupplier === supplierId ? null : supplierId);
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="inventory-container">
      {Object.entries(inventory).map(([supplierId, { supplier_name, products }]) => {
        const totalQuantity = products.reduce((sum, product) => sum + product.quantity, 0);

        // Convert price to number and calculate total price correctly
        const totalPrice = products.reduce((sum, product) => sum + parseFloat(product.price)*product.quantity, 0);

        return (
          <div key={supplierId} className="supplier-row">
            <div className="supplier-header">
              <span>Supplier ID: {supplierId}</span>
              <span>Name: {supplier_name}</span>
              <button
                className="toggle-products-button"
                onClick={() => toggleSupplierProducts(supplierId)}
              >
                {expandedSupplier === supplierId ? 'Hide Products' : 'Show Products'}
              </button>
            </div>
            {expandedSupplier === supplierId && (
              <div className="products-table">
                <table>
                  <thead>
                    <tr>
                      <th className="table-header">Product Name</th>
                      <th className="table-header">Price</th>
                      <th className="table-header">Quantity</th>
                      <th className="table-header">Supplied On</th>
                      <th className="table-header">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>Rs {product.price}</td>
                        <td>{product.quantity}</td>
                        <td>{product.date_supplied}</td>
                        <td>
                          <button
                            className="read-more-button"
                            onClick={() => alert(`Description: ${product.description}`)}
                          >
                            Read More
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="totals-section">
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

export default InventoryPage;
