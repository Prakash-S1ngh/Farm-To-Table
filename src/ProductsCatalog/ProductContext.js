import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create context
export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/farmers/api/v2/getAllproducts');

        setProducts(response.data.products);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Cart functionality
  const addToCart = (product) => {
    setCartItems((prevItems) => [...prevItems, { ...product, quantity: 1 }]);
  };

  const removeFromCart = (name) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.name !== name));
  };

  const incrementQuantity = (name) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.name === name && item.quantity < (item.stock || 999)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decrementQuantity = (name) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.name === name && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Wishlist functionality
  const addToWishlist = (product) => {
    setWishlist((prevWishlist) => {
      // Check if the product is already in the wishlist
      if (prevWishlist.find((item) => item.name === product.name && item.category_id === product.category_id)) {
        return prevWishlist; // Product already in wishlist, no need to add
      }
      console.log('Adding to wishlist:', [...prevWishlist, product]);
      return [...prevWishlist, product];
    });
  };

  const removeFromWishlist = (name) => {
    setWishlist((prevWishlist) => prevWishlist.filter((item) => item.name !== name));
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        cartItems,
        wishlist,
        addToCart,
        removeFromCart,
        incrementQuantity,
        decrementQuantity,
        addToWishlist,
        removeFromWishlist,
        setCartItems,
        loading,
        error,
        setWishlist
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;
