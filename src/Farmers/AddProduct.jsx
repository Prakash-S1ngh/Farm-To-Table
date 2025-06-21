import React, { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [categoryname, setCategoryname] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showTerms, setShowTerms] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowTerms(true);
  };
  
  const confirmSubmit = async () => {
    setShowTerms(false);
    setLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('categoryname', categoryname);
    formData.append('price', price);
    formData.append('quantity', quantity);
    formData.append('description', description);
    formData.append('image', image);

    try {
      const response = await axios.post(
        'http://localhost:4000/farmers/api/v2/addProducts',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );
      setMessage(response.data.message);
    } catch (error) {
      console.error(error);
      setMessage('Error adding product');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-300">
        <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full">
          
          <h1 className="text-3xl font-bold text-center text-gray-800">Add New Product</h1>

          {loading && (
            <div className="text-center text-blue-600 mt-4 animate-spin">Loading...</div>
          )}
          
          {message && (
            <div className={`text-center mt-4 font-bold ${message.includes('Error') ? 'text-red-500' : 'text-green-600'}`} >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col space-y-4">
            
            <label className="text-gray-700 font-bold">Product Name</label>
            <input
              type="text"
              value={name}
              placeholder="Enter product name"
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:border-blue-500"
            />

            <label className="text-gray-700 font-bold">Category Name</label>
            <select
              value={categoryname}
              onChange={(e) => setCategoryname(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:border-blue-500"
            >
              <option value="" disabled>Select a category</option>
              <option value="CAT5">Dairy</option>
              <option value="CAT1">Fruits</option>
              <option value="CAT6">Other</option>
              <option value="CAT4">Special</option>
              <option value="CAT3">Spices</option>
              <option value="CAT2">Vegetables</option>
            </select>

            <label className="text-gray-700 font-bold">Price (₹)</label>
            <input
              type="number"
              value={price}
              placeholder="Enter price per kg"
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:border-blue-500"
            />

            <label className="text-gray-700 font-bold">Quantity (KG)</label>
            <input
              type="number"
              value={quantity}
              placeholder="Enter quantity"
              onChange={(e) => setQuantity(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:border-blue-500"
            />

            <label className="text-gray-700 font-bold">Description</label>
            <textarea
              value={description}
              placeholder="Enter description"
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:border-blue-500"
            />

            <label className="text-gray-700 font-bold">Product Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              required
              className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg p-3 font-bold text-lg transform hover:scale-105 transition-transform"
            >
              Add Product
            </button>
            
          </form>
        </div>
      </div>

      {showTerms && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-60 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Terms & Conditions</h2>
            <p className="text-gray-600">
              By submitting this product, you agree to become a supplier bound by the terms and conditions of the marketplace. 
              Once the Admin approves your listing, you must adhere to these terms for continued participation.
            </p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setShowTerms(false)}
                className="bg-gray-300 rounded-lg px-4 py-2 hover:bg-gray-400"
              >
                No
              </button>
              <button
                onClick={confirmSubmit}
                className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg px-4 py-2 font-bold hover:scale-105 transform transition"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddProduct;