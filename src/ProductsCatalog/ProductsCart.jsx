import React, { useContext, useEffect, useState } from 'react';
import './ProductCart.css'; // Ensure to create this CSS file for styling
import Header from '../components/Header';
import UserContext from '../Users/Context/UserContext';
import { useNavigate } from 'react-router-dom';
import ProductContext from './ProductContext';

const ProductsCart = () => {
  const navigate = useNavigate();
  const { isUser } = useContext(UserContext); 
  const {
    products,
    loading,
    error,
    addToCart // Use ProductContext for product and cart management
  } = useContext(ProductContext);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('CAT0');

  // Handle redirection if the user is not logged in
  const cartHandler = (product) => {
    if (!isUser) {
      navigate('/login');
    } else {
      addToCart(product); // Add product to the cart using ProductContext
    }
  };

  useEffect(() => {
    // Set initial filtered products when products are loaded
    if (products.length > 0) {
      setFilteredProducts(products);
    }
  }, [products]);

  useEffect(() => {
    // Filter products based on selected category
    if (selectedCategory === 'CAT0') {
      setFilteredProducts(products); // Show all products if 'All items' is selected
    } else {
      const filtered = products.filter(
        (product) => product.category_id === selectedCategory
      );
      setFilteredProducts(filtered);
    }
  }, [selectedCategory, products]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading message while fetching data
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Show error message if any
  }

  return (
    <div>
      <Header />
      <div className="product-container">
        <aside className="filters-sidebar">
          <div className="category-section">
            <h3>All Categories</h3>
            <ul className="category-list">
              <li>
                <input
                  type="radio"
                  name="category"
                  value="CAT0"
                  checked={selectedCategory === 'CAT0'}
                  onChange={handleCategoryChange}
                />{' '}
                All items
              </li>
              <li>
                <input
                  type="radio"
                  name="category"
                  value="CAT1"
                  checked={selectedCategory === 'CAT1'}
                  onChange={handleCategoryChange}
                />{' '}
                Fresh Fruit
              </li>
              <li>
                <input
                  type="radio"
                  name="category"
                  value="CAT2"
                  checked={selectedCategory === 'CAT2'}
                  onChange={handleCategoryChange}
                />{' '}
                Vegetables
              </li>
              <li>
                <input
                  type="radio"
                  name="category"
                  value="CAT5"
                  checked={selectedCategory === 'CAT5'}
                  onChange={handleCategoryChange}
                />{' '}
                Dairy
              </li>
              <li>
                <input
                  type="radio"
                  name="category"
                  value="CAT3"
                  checked={selectedCategory === 'CAT3'}
                  onChange={handleCategoryChange}
                />{' '}
                Spices
              </li>
              <li>
                <input
                  type="radio"
                  name="category"
                  value="CAT4"
                  checked={selectedCategory === 'CAT4'}
                  onChange={handleCategoryChange}
                />{' '}
                Exotics
              </li>
              <li>
                <input
                  type="radio"
                  name="category"
                  value="CAT6"
                  checked={selectedCategory === 'CAT6'}
                  onChange={handleCategoryChange}
                />{' '}
                Others
              </li>
            </ul>
          </div>
        </aside>

        <div className="right-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <div key={index} className="product-card">
                <img src={product.prodImage} alt={product.name} />
                <h3>{product.name}</h3>
                <p>Price: Rs {product.price}</p>
                <button onClick={() => cartHandler(product)}>Add to Cart</button>
              </div>
            ))
          ) : (
            <p>No products available in this category.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsCart;
