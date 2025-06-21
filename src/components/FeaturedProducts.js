import React, { useContext } from 'react';
import ProductCard from './ProductCard';
import { Heart, ShoppingCart } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    return shuffledProducts.slice(0, 10); // First 10 or fewer products
  };

  const randomProducts = getRandomProducts(products);

  // Handlers for add to cart and wishlist with toast messages
  const handleAddToCart = (product) => {
    if (product) {
      addToCart(product);
      toast.success(`${product.name} added to cart!`);
    }
  };

  const handleAddToWishlist = (product) => {
    if (product) {
      addToWishlist(product);
      toast.info(`${product.name} added to wishlist!`);
    }
  };

  return (
    <section className="featured-products max-w-[1200px] mx-auto p-10 bg-gray-50 text-center font-sans">
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

      <h2 className="text-4xl md:text-4xl font-extrabold mb-8 text-gray-900 uppercase tracking-widest drop-shadow-sm">
        Our Featured Products
      </h2>

      <div className="product-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
        {randomProducts.length > 0 ? (
          randomProducts.map((product, index) => (
            <div
              key={index}
              className={`product-box bg-white rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-2 transition duration-300 w-full max-w-xs flex flex-col`}
            >
              <ProductCard {...product} />

              <div className="product-actions flex gap-4 p-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl py-3 font-semibold text-sm shadow-md hover:from-blue-600 hover:to-indigo-700 hover:scale-105 transition-transform"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>

                <button
                  onClick={() => handleAddToWishlist(product)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl py-3 font-semibold text-sm shadow-md hover:from-red-600 hover:to-pink-700 hover:scale-105 transition-transform"
                >
                  <Heart size={20} />
                  Wishlist
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full">No products available at the moment.</p>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;