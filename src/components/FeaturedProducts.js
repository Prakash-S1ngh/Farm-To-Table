
import React from 'react';
import ProductCard from './ProductCard';
import { Heart, ShoppingCart, User } from 'lucide-react';

const FeaturedProducts = () => {
  const products = [
    { name: "Green Lettuce", price: 50, image: "https://www.thespruceeats.com/thmb/vaBl4HDwLRUUwBqN2Io-6Yx_RRo=/2145x1398/filters:no_upscale():max_bytes(150000):strip_icc()/Butter-Lettuce-57936a725f9b58173b7d7357.jpg", className: 'lettuce' },
    { name: "Red Tomatoes", price: 25, image: "https://wallpapercrafter.com/desktop1/615675-tomato-lot-vegetable-food-freshness-red-organic.jpg", className: 'tomatoes' },
    { name: "Yellow Corn", price: 60, image: "https://img.freepik.com/premium-photo/fresh-yellow-corn-cobs-juicy-fresh-ears-corn-harvest-box-summer-autumn-harvest_683834-151.jpg", className: 'corn' },
    { name: "Watermelon", price: 35, image: "http://upload.wikimedia.org/wikipedia/commons/4/40/Watermelons.jpg", className: 'watermelon' },
    { name: "Mango", price: 80, image: "https://www.pigprogress.net/app/uploads/2022/11/IMG_Mango.jpg", className: 'mango' },
    { name: "Guava", price: 30, image: "https://cdn.davidwolfe.com/wp-content/uploads/2016/06/guava-e1465856267494.jpg", className: 'guava' },
    { name: "Pineapple", price: 75, image: "https://www.icirnigeria.org/wp-content/uploads/2022/10/pineapple-from-Maxpixel.jpg", className: 'pineapple' },
    { name: "Cabbage", price: 20, image: "https://s3.amazonaws.com/com.niches.production/story_images/new_images/000/004/690/original/how-much-is-in-a-cabbage-1.jpg", className: 'cabbage' },
    { name: "Potato", price: 15, image: "https://wallpaperaccess.com/full/1986273.jpg", className: 'ladyfinger' },
    { name: "Avocado", price: 95, image: "https://minnetonkaorchards.com/wp-content/uploads/2022/09/Indoor-Avocado-Tree-SS-2031462932.jpg", className: 'avocado' },
   
  ];

  return (
    <section className="featured-products">
      <h2>Our Featured Products</h2>
      <div className="product-grid">
        {products.map((product, index) => (
          <div key={index} className={`product-box ${product.className}`}>
            <ProductCard {...product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
