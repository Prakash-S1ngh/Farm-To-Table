
// src/components/Shop.js
import React, { useState } from 'react';
import './Shop.css';
import productsData from './productsData'; // Import the data

const categories = [
    { name: 'Fresh Vegetables', className: 'vegetables', image:"https://wallpapersmug.com/download/1920x1080/930962/vegetables-fresh.jpg" },
    { name: 'Fresh Fruits', className: 'fruits', image:"https://img.freepik.com/premium-photo/fresh-fruit_773230-2225.jpg" },
    { name: 'Grains', className: 'grains', image:"https://wholegrainscouncil.org/sites/default/files/thumbnails/image/Fotolia_72510345_M_oats.jpg" },
    { name: 'Teas', className: 'teas', image:"https://fthmb.tqn.com/1TiXfpDUtJOIIBM5kS01rIFRYSM=/960x0/filters:no_upscale()/GettyImages-126372448-5849a8615f9b58dcccf69b22.jpg" },
    { name: 'Dairy', className: 'dairy', image:"https://www.dairyprocessing.com/ext/resources/2022/07/19/dairy-organic-milk-dairy-farm-organic-dairy-products.jpg?height=667&t=1658243746&width=1080" },
    { name: 'Natural Supplements', className: 'supplements', image:"https://pharmaceutical-journal.com/wp-content/uploads/2021/01/herbal-medicines-ss-18-scaled.jpg" },
    { name: 'Flowers & Plants', className: 'flowers', image:"https://www.thespruce.com/thmb/ZnfkVGaUAuuEKgl8pAZ94uAwHxY=/2120x1414/filters:fill(auto,1)/GettyImages-589658597-591cfe1b3df78cf5fa539d91.jpg" },
    { name: 'Mushrooms', className: 'mushrooms',image:"https://www.treehugger.com/thmb/MuunU9ozYjd6yTxrnpaFfXS3QEg=/1000x667/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__mnn__images__2017__10__Amanita_muscaria-c14db283610642a7b02e7cb261da93da.jpg" },

];

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // Filter products based on selected category, if any
  const filteredProducts = selectedCategory
    ? productsData.filter((product) =>
        product.name.toLowerCase().includes(selectedCategory.toLowerCase())
      )
    : productsData;

  return (
    <div className="shop-layout">
      {/* Left side categories */}
      <aside className="categories-container">
        <h3>Categories</h3>
        <select className="category-dropdown" onChange={handleCategoryChange} value={selectedCategory}>
          <option value="">All Categories</option>
          {categories.map((category, index) => (
            <option key={index} value={category.name}>{category.name}</option>
          ))}
        </select>
        <div className="category-images">
          {categories.map((category, index) => (
            <div key={index} className="category-item">
              <img src={category.image} alt={category.name} />
              <p>{category.name}</p>
            </div>
          ))}
        </div>
      </aside>

      {/* Right side products */}
      <div className="shop-container">
        {filteredProducts.map((product) => (
          <div key={product.product_id} className="product-card">
            <img src={product.prodImage} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.price}</p>
            <p>{product.description}</p>
            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
