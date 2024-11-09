import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignupForm from './Users/Signup.jsx';
import Login from './Users/Login.jsx';
import Home from './components/Home.jsx';
import Forgot from './Users/Password/Forgot.jsx';
import ResetPassword from './Users/Password/ResetPassword.jsx';
import UserContextProvider from './Users/Context/UserContextProvider'; // Import the provider
import './App.css';
import Profile from './Users/Profile.jsx';
import AddProduct from './Farmers/AddProduct.jsx';
import FarmerProd from './Farmers/FarmerProd.jsx';
import Shop from './components/Shop.js';
import AboutUs from './components/AboutUs.jsx';
import ProductsCart from './ProductsCatalog/ProductsCart.jsx';
import Cart from './Carts/Cart.jsx';
import { ProductProvider } from './ProductsCatalog/ProductContext.js';
import Payment from './Payment/Payment.jsx';
import OrderHistory from './Users/OrderHistory.jsx';
// import ProductdCard from './components/ProductCard.js';

const App = () => {
  return (
    <UserContextProvider> {/* Wrapping the app with UserContextProvider */}
    <ProductProvider>
      <div className="app">
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/signin' element={<SignupForm />} />
          <Route path='/login' element={<Login />} />
          <Route path='/forgotpassword' element={<Forgot/>}/>
          <Route path='/verifyotp' element={<ResetPassword/>}/>
          <Route path='/UserProfile' element={<Profile/>}/>
          <Route path='/addproducts' element={<AddProduct/>}/>
          <Route path='/FarmProducts' element={<FarmerProd/>}/>
          <Route path='/shop' element={<ProductsCart/>}/>
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/Payment" element={<Payment />} />
          <Route path="/Payment" element={<Payment />} />
          <Route path="/ordersHistory" element={<OrderHistory/>} />



        </Routes>
      </div>
      </ProductProvider>
    </UserContextProvider>
  );
};

export default App;
