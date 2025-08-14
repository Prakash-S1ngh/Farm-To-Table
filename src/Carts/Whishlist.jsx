import React, { useContext, useState, useEffect } from 'react';
import ProductContext from '../ProductsCatalog/ProductContext';
import Header from '../components/Header';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const api = 'http://localhost:4000/users/api/v2';

const Wishlist = () => {
  const {
    wishlist,
    removeFromWishlist,
    addToCart,
    setWishlist, // context setter
  } = useContext(ProductContext);
  const [currWishlist, setCurrWishlist] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading true

  // ✅ Initial fetch on component mount
  useEffect(() => {
    const fetchInitialWishlist = async () => {
      try {
        setLoading(true);
        console.log('Fetching initial wishlist...');
        const res = await axios.get(`${api}/wishlist`, { withCredentials: true });
        console.log('Initial wishlist response:', res.data);
        
        const fetchedWishlist = res.data.wishlist || [];
        console.log('Setting initial wishlist to:', fetchedWishlist);
        setCurrWishlist(fetchedWishlist);
      } catch (error) {
        console.error('Error fetching initial wishlist:', error);
        toast.error(`Error fetching wishlist: ${error.response?.data?.message || error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialWishlist();
  }, []); // Only run on mount

  // ✅ Sync wishlist when context wishlist has items
  useEffect(() => {
    const syncWishlist = async () => {
      if (wishlist.length === 0) return; // Don't sync if no items
      
      try {
        console.log('Syncing in-memory wishlist to database:', wishlist);
        const saveResponse = await axios.post(`${api}/createwishlist`, { items: wishlist }, { withCredentials: true });
        console.log('Save response:', saveResponse.data);

        // Fetch updated wishlist after saving
        const res = await axios.get(`${api}/wishlist`, { withCredentials: true });
        console.log('Updated wishlist response after sync:', res.data);
        
        const fetchedWishlist = res.data.wishlist || [];
        setCurrWishlist(fetchedWishlist);

        // Clear the in-memory wishlist now that it's saved
        setWishlist([]);
        toast.success('Wishlist updated successfully!');
      } catch (error) {
        console.error('Error syncing wishlist:', error);
        toast.error(`Error syncing wishlist: ${error.response?.data?.message || error.message}`);
      }
    };
    
    syncWishlist();
  }, [wishlist.length]); // Only depend on length to avoid infinite loops

  // ✅ Remove item from backend and update currWishlist
  const handleRemove = async (product) => {
    try {
      console.log('Removing product from wishlist:', product);
      const response = await axios.delete(`${api}/wishlist/${product.name}`, { withCredentials: true });
      console.log('Remove response:', response.data);
      
      setCurrWishlist((prev) => prev.filter((item) => item.name !== product.name));
      toast.success(`${product.name} removed from wishlist!`);
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error(`Error removing item: ${error.response?.data?.message || error.message}`);
    }
  };

  // ✅ Add to cart and remove from wishlist
  const handleAddToCart = async (product) => {
    try {
      console.log('Adding product to cart and removing from wishlist:', product);
      
      // First add to cart via API
      const cartResponse = await axios.post(`${api}/wishlist-to-cart`, {
        name: product.name,
        quantity: product.quantity || 1,
        price: product.price,
        prodImage: product.prodImage
      }, { withCredentials: true });
      
      console.log('Add to cart response:', cartResponse.data);
      
      // Then remove from wishlist
      const wishlistResponse = await axios.delete(`${api}/wishlist/${product.name}`, { withCredentials: true });
      console.log('Remove from wishlist response:', wishlistResponse.data);
      
      // Update local state
      setCurrWishlist((prev) => prev.filter((item) => item.name !== product.name));
      
      // Also update context wishlist
      removeFromWishlist(product.name);
      
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error(`Error adding item to cart: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <>
      <Header />
      <ToastContainer />
      <div className="min-h-screen py-10 bg-gradient-to-b from-gray-100 to-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800">My Wishlist</h2>

          {loading ? (
            <p className="text-center mt-8 text-gray-600 text-lg">Loading wishlist...</p>
          ) : currWishlist.length === 0 ? (
            <p className="text-center mt-8 text-gray-600 text-lg">Your wishlist is empty</p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {currWishlist.map((product) => (
                <div
                  key={product.name}
                  className="bg-white rounded-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 flex flex-col"
                >
                  <img
                    src={product.prodImage}
                    alt={product.name}
                    className="h-48 w-full object-cover rounded-t-lg"
                  />
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-gray-600 mt-2">Price: Rs {product.price}</p>
                    <div className="mt-auto flex justify-between space-x-2 pt-4">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 flex-1 transition"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleRemove(product)}
                        className="bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2 flex-1 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Wishlist;