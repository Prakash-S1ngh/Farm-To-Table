import React, { useContext } from 'react';
import ProductCard from './ProductCard';
import { Heart, ShoppingCart } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Feature.css';
import ProductContext from '../ProductsCatalog/ProductContext';

const FeaturedProducts = () => {
  // Access products, addToCart, and addToWishlist from ProductContext
  const { products, addToCart, addToWishlist } = useContext(ProductContext);

  // Function to get 10 random products
  const getRandomProducts = (products) => {
    if (!Array.isArray(products)) {
      console.error('Products is not an array:', products);
      return [];
    }
    const shuffledProducts = [...products].sort(() => 0.5 - Math.random());
    return shuffledProducts.slice(0, 10); // Always return the first 10 products (or fewer if not available)
  };

  const randomProducts = getRandomProducts(products);

  // Update addToCart to use context function
  const handleAddToCart = (product) => {
    if (product) {
      addToCart(product); // Call the addToCart function from ProductContext
      toast.success(`${product.name} added to cart!`);
    }
  };

  // Update addToWishlist to use context function
  const handleAddToWishlist = (product) => {
    if (product) {
      addToWishlist(product); // Call the addToWishlist function from ProductContext
      toast.info(`${product.name} added to wishlist!`);
    }
  };

  return (
    <section className="featured-products">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <h2>Our Featured Products</h2>
      <div className="product-grid">
        {randomProducts.length > 0 ? (
          randomProducts.map((product, index) => (
            <div key={index} className={`product-box ${product.className}`}>
              <ProductCard {...product} />
              <div className="product-actions">
                <button onClick={() => handleAddToCart(product)}>
                  <ShoppingCart size={20} /> Add to Cart
                </button>
                <button onClick={() => handleAddToWishlist(product)}>
                  <Heart size={20} /> Wishlist
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No products available at the moment.</p>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
