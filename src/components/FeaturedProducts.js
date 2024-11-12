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
    const shuffledProducts = [...products].sort(() => 0.5 - Math.random());
    return shuffledProducts.slice(0, 10); // Always return the first 10 products (or fewer if not available)
  };

  const randomProducts = getRandomProducts(products);

  // Update addToCart to use context function
  const handleAddToCart = (product) => {
    addToCart(product); // Call the addToCart function from ProductContext
    toast.success(`${product.name} added to cart!`);
  };

  // Update addToWishlist to use context function
  const handleAddToWishlist = (product) => {
    addToWishlist(product); // Call the addToWishlist function from ProductContext
    toast.info(`${product.name} added to wishlist!`);
  };

  return (
    <section className="featured-products">
      <ToastContainer
  position="top-center" // This will position the toast notifications at the top center of the page
  autoClose={3000} // Optional: Duration for the toast to auto-close (in milliseconds)
  hideProgressBar={false} // Optional: Show or hide the progress bar
  newestOnTop={true} // Optional: Show newest toast notifications on top
  closeOnClick // Optional: Close the toast when clicked
  rtl={false} // Optional: Right-to-left text direction
  pauseOnFocusLoss // Optional: Pause the timer when the window loses focus
  draggable // Optional: Allow drag and dismiss
  pauseOnHover // Optional: Pause the timer when hovered
/>

      <h2>Our Featured Products</h2>
      <div className="product-grid">
        {randomProducts.map((product, index) => (
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
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
