import React, { useContext, useEffect, useState } from 'react';
import './ProductCart.css';
import Header from '../components/Header';
import UserContext from '../Users/Context/UserContext';
import { useNavigate } from 'react-router-dom';
import ProductContext from './ProductContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineHeart } from 'react-icons/ai';

const ProductsCart = () => {
  const navigate = useNavigate();
  const { isUser } = useContext(UserContext);
  const {
    products = [], // Fallback to an empty array
    loading,
    error,
    addToCart,
    addToWishlist,
  } = useContext(ProductContext);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('CAT0');

  useEffect(() => {
    // Initialize filtered products or log invalid data
    if (Array.isArray(products)) {
      setFilteredProducts(products);
    } else {
      console.error('Invalid products data:', products);
    }
  }, [products]);

  useEffect(() => {
    // Update filtered products when category changes
    setFilteredProducts(
      selectedCategory === 'CAT0'
        ? products
        : products.filter((product) => product.category_id === selectedCategory)
    );
  }, [selectedCategory, products]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const cartHandler = (product) => {
    if (!isUser) {
      navigate('/login');
    } else {
      addToCart(product);
      toast.success(`${product.name} added to cart successfully!`);
    }
  };

  const wishlistHandler = (product) => {
    if (!isUser) {
      navigate('/login');
    } else {
      addToWishlist(product);
      toast.info(`${product.name} added to wishlist successfully!`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <Header />
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} />

      <div className="product-container">
        <aside className="filters-sidebar">
          <h3>All Categories</h3>
          <ul className="category-list">
            {[
              { id: 'CAT0', label: 'All items' },
              { id: 'CAT1', label: 'Fresh Fruit' },
              { id: 'CAT2', label: 'Vegetables' },
              { id: 'CAT5', label: 'Dairy' },
              { id: 'CAT3', label: 'Spices' },
              { id: 'CAT4', label: 'Exotics' },
              { id: 'CAT6', label: 'Others' },
            ].map(({ id, label }) => (
              <li key={id}>
                <input
                  type="radio"
                  name="category"
                  value={id}
                  checked={selectedCategory === id}
                  onChange={handleCategoryChange}
                />{' '}
                {label}
              </li>
            ))}
          </ul>
        </aside>

        <div className="right-grid">
          {console.log("the products of world  ", filteredProducts)}
          {filteredProducts.length > 0 ? (
            
            filteredProducts.map((product, index) => (
              <div key={index} className="product-card">
                <img src={product.prodImage || 'default-image-url.jpg'} alt={product.name} />
                <h3>{product.name}</h3>
                <p>Price: Rs {product.price || 'N/A'}</p>
                <div className="product-actions">
                  <button
                    className="product-action-btn"
                    onClick={() => cartHandler(product)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="product-action-btn"
                    onClick={() => wishlistHandler(product)}
                  >
                    <AiOutlineHeart size={20} /> Wishlist
                  </button>
                </div>
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
