const express = require('express');
const { createUser, loginUser, forgotpassword, validateOtp , getUser, updateUser, setImageForProfile } = require('../controller/User.controller');
const { authorization } = require('../middleware/authorization.middleware');
const upload = require('../config/multer.config');
const { createOrder, getOrders, createCart, deleteCartItem, updateCartItem, getCartItems, getWishlistController, addToWishlistController, deleteWishlistController, addWishlistItemToCart, clearCart, getOrderStatus } = require('../controller/Order.controller');
const router = express.Router();

router.post('/createUser',upload.single('image'),createUser);
router.route('/login').post(loginUser);
router.route('/forgotpassword').post(forgotpassword);
router.post('/verifying',authorization,validateOtp);
// router.post('/createAddress', authorization,createAddress);
router.get('/GetUser', authorization,getUser);
router.post('/updateUser',authorization,updateUser);

//wishlist
router.get('/wishlist',authorization, getWishlistController);
router.post('/createwishlist',authorization , addToWishlistController);
router.delete('/wishlist/:name',authorization, deleteWishlistController);
router.post('/wishlist-to-cart',authorization, addWishlistItemToCart);

//cart
router.post('/createcart',authorization,createCart);
router.get('/getcart',authorization,getCartItems);
router.delete('/deletecart/:name',authorization,deleteCartItem);
router.patch('/updateCart',authorization,updateCartItem);

//orders
router.post('/orders',authorization,createOrder);
router.get('/orders',authorization,getOrders);
router.get('/orders/:order_id/status',authorization,getOrderStatus);
router.delete('/clear-cart',authorization,clearCart);


module.exports = router; 
