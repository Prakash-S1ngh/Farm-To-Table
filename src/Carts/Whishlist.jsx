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
  const [loading, setLoading] = useState(false);

  // ✅ Main Effect
  useEffect(() => {
    const fetchAndSyncWishlist = async () => {
      try {
        setLoading(true);
        if (wishlist.length > 0) {
          // 1️⃣ First save the in-memory wishlist to the database
          await axios.post(`${api}/createwishlist`, { items: wishlist }, { withCredentials: true });
        }

        // 2️⃣ Then fetch the updated wishlist from the database
        const res = await axios.get(`${api}/wishlist`, { withCredentials: true });
        console.log('Fetched wishlist from server:', res.data.wishlist);
        setCurrWishlist(res.data.wishlist || []);
        console.log('Current wishlist:', currWishlist);

        // 3️⃣ Clear the in-memory wishlist now that it's saved
        setWishlist([]);
      } catch (error) {
        console.error(error);
        toast.error('Error syncing wishlist!');
      } finally {
        setLoading(false);
      }
    };
    fetchAndSyncWishlist();
  }, [wishlist, setWishlist]);

  // ✅ Remove item from backend and update currWishlist
  const handleRemove = async (product) => {
    try {
      await axios.delete(`${api}/wishlist/${product.id}`, { withCredentials: true });
      setCurrWishlist((prev) => prev.filter((item) => item.id !== product.id));
      toast.success(`${product.name} removed from wishlist!`);
    } catch (error) {
      console.error(error);
      toast.error('Error removing item!');
    }
  };

  // ✅ Add to cart and remove from wishlist
  const handleAddToCart = async (product) => {
    try {
      addToCart(product);
      await axios.delete(`${api}/wishlist/${product.id}`, { withCredentials: true });
      setCurrWishlist((prev) => prev.filter((item) => item.id !== product.id));
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error(error);
      toast.error('Error adding item to cart!');
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
                  key={product.id}
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