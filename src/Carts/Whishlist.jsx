import React, { useContext } from 'react';
import './Whishlist.css';
import ProductContext from '../ProductsCatalog/ProductContext';
import Header from '../components/Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, addToCart } = useContext(ProductContext);

  const handleAddToCart = (product) => {
    addToCart(product); // Add product to the cart
    removeFromWishlist(product.product_id); // Remove product from the wishlist
    toast.success('Product moved to cart successfully!');
  };

  return (
    <>
      <Header />
      <ToastContainer /> {/* Toastify container for notifications */}
      <div className="wishlist-container">
        <h2>My Wishlist</h2>
        {wishlist.length === 0 ? (
          <p>Your wishlist is empty</p>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((product) => (
              <div key={product.product_id} className="wishlist-card">
                <img src={product.prodImage} alt={product.name} />
                <h3>{product.name}</h3>
                <p>Price: Rs {product.price}</p>
                <div className="wishlist-actions">
                  <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
                  <button onClick={() => removeFromWishlist(product.product_id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Wishlist;
