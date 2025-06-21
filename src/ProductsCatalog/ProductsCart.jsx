import React, { useContext, useEffect, useState } from 'react';
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
    products = [],
    loading,
    error,
    addToCart,
    addToWishlist,
  } = useContext(ProductContext);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('CAT0');
  const [selectedDescription, setSelectedDescription] = useState('');

  useEffect(() => {
    if (Array.isArray(products)) {
      setFilteredProducts(products);
    } else {
      console.error('Invalid products data:', products);
    }
  }, [products]);

  useEffect(() => {
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
  if (loading) return <div className="text-center py-10 text-lg">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error.message}</div>;

  return (
    <>
      <Header />
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="flex flex-col lg:flex-row gap-8 px-6 py-8 bg-gray-50 min-h-screen">
        {/* Sidebar */}
        <aside className="w-full lg:w-72 bg-white rounded-xl shadow-lg p-6 select-none sticky top-8 self-start">
          <h3 className="text-2xl font-bold text-green-700 mb-6 border-b-2 border-green-400 pb-2">Categories</h3>
          <ul className="space-y-4" role="radiogroup" aria-label="Product categories">
            {[
              { id: 'CAT0', label: 'All items' },
              { id: 'CAT1', label: 'Fresh Fruit' },
              { id: 'CAT2', label: 'Vegetables' },
              { id: 'CAT5', label: 'Dairy' },
              { id: 'CAT3', label: 'Spices' },
              { id: 'CAT4', label: 'Exotics' },
              { id: 'CAT6', label: 'Others' },
            ].map(({ id, label }) => (
              <li key={id} className="flex items-center cursor-pointer">
                <label className="flex items-center gap-3 text-gray-700 font-semibold">
                  <input
                    type="radio"
                    name="category"
                    value={id}
                    checked={selectedCategory === id}
                    onChange={handleCategoryChange}
                    className="accent-green-500 w-5 h-5 cursor-pointer"
                  />
                  {label}
                </label>
              </li>
            ))}
          </ul>
        </aside>

        {/* Products Grid */}
        <main className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <article
                key={index}
                tabIndex={0}
                className="bg-white rounded-xl shadow-md overflow-hidden transform transition-transform hover:-translate-y-2 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-300 flex flex-col"
              >
                <img
                  src={product.prodImage || 'default-image-url.jpg'}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-48 object-cover"
                />
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-green-700 mb-2 truncate">{product.name}</h3>
                  <p className="text-green-600 font-bold text-md mb-3">₹{product.price ?? 'N/A'}</p>
                  {product.description ? (
                    <button
                      className="text-blue-600 text-sm hover:underline self-start"
                      onClick={() => setSelectedDescription(product.description)}
                    >
                      View Details
                    </button>
                  ) : (
                    <p className="text-gray-500 text-sm">No description available</p>
                  )}
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => cartHandler(product)}
                      aria-label={`Add ${product.name} to cart`}
                      className="flex-1 bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-400 focus:outline-none rounded-md py-2 text-white font-semibold transition"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => wishlistHandler(product)}
                      aria-label={`Add ${product.name} to wishlist`}
                      className="flex items-center justify-center gap-2 px-4 rounded-md bg-pink-600 hover:bg-pink-700 focus:ring-2 focus:ring-pink-400 focus:outline-none text-white font-semibold transition"
                    >
                      <AiOutlineHeart size={20} />
                      Wishlist
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 font-medium">
              No products available in this category.
            </p>
          )}
        </main>
      </div>

      {/* Modal for description */}
      {selectedDescription && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedDescription('')}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-green-700">Description</h3>
            <p className="text-gray-600 mt-4 leading-relaxed whitespace-pre-line">{selectedDescription}</p>
            <button
              onClick={() => setSelectedDescription('')}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductsCart;