import React, { useState } from 'react';

// Import images from local folder
import vegetable from './images/vegetable.jpg';
import fruits from './images/fruits.avif';
import grains from './images/grains.webp';
import teas from './images/teas.jpg';
import dairy from './images/dairy.jpg';
import supplements from './images/supplements.webp';
import flowers from './images/flowers.jpg';
import mushrooms from './images/mushrooms.jpg';

import productsData from './productsData';

const categories = [
  { name: 'Fresh Vegetables', className: 'vegetables', image: vegetable },
  { name: 'Fresh Fruits', className: 'fruits', image: fruits },
  { name: 'Grains', className: 'grains', image: grains },
  { name: 'Teas', className: 'teas', image: teas },
  { name: 'Dairy', className: 'dairy', image: dairy },
  { name: 'Natural Supplements', className: 'supplements', image: supplements },
  { name: 'Flowers & Plants', className: 'flowers', image: flowers },
  { name: 'Mushrooms', className: 'mushrooms', image: mushrooms },
];

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // Filter products based on selected category (assuming each product has category field)
  const filteredProducts = selectedCategory
    ? productsData.filter(
        (product) =>
          product.category &&
          product.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    : productsData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:space-x-8">
        {/* Categories Sidebar */}
        <aside className="md:w-1/4 mb-8 md:mb-0 bg-white rounded-lg shadow p-6">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Categories</h3>

          {/* Dropdown for mobile */}
          <select
            className="w-full mb-6 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            onChange={handleCategoryChange}
            value={selectedCategory}
          >
            <option value="">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Category images clickable */}
          <div className="space-y-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className={`cursor-pointer rounded-lg overflow-hidden shadow-md transform transition duration-300 ease-in-out
                  ${
                    selectedCategory === category.name
                      ? 'ring-4 ring-green-400 scale-105'
                      : 'hover:scale-105 hover:shadow-lg'
                  }`}
                onClick={() => setSelectedCategory(category.name)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setSelectedCategory(category.name);
                }}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-32 object-cover"
                />
                <p className="text-center text-lg font-semibold py-2 text-gray-700">
                  {category.name}
                </p>
              </div>
            ))}
          </div>
        </aside>

        {/* Products Grid */}
        <main className="md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.product_id}
                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
              >
                <img
                  src={product.prodImage}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {product.name}
                  </h3>
                  <p className="text-green-600 font-bold text-lg mb-2">
                    ₹{product.price}
                  </p>
                  <p className="text-gray-600 flex-grow">{product.description}</p>
                  <button
                    className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
                    type="button"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full text-lg mt-10">
              No products available in this category.
            </p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;