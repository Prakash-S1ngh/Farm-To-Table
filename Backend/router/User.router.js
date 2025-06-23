const express = require('express');
const { createUser, loginUser, forgotpassword, validateOtp , getUser, updateUser, setImageForProfile } = require('../controller/User.controller');
const { authorization } = require('../middleware/authorization.middleware');
const upload = require('../config/multer.config');
const { createOrder, getOrders, createCart, deleteCartItem, updateCartItem, getCartItems, getWishlistController, addToWishlistController, deleteWishlistController } = require('../controller/Order.controller');
const router = express.Router(); 

router.post('/createUser',upload.single('image'),createUser);
router.route('/login').post(loginUser);
router.route('/forgotpassword').post(forgotpassword);
router.post('/verifying',authorization,validateOtp);
// router.post('/createAddress', authorization,createAddress);
router.get('/GetUser', authorization,getUser);
router.post('/updateUser',authorization,updateUser);
router.post('/orders',authorization,createOrder);
router.get('/getorders',authorization,getOrders);

//cart
router.post('/createcart',authorization,createCart);
router.get('/getcart',authorization,getCartItems);
router.delete('/deletecart',authorization,deleteCartItem);
router.patch('/updateCart',authorization,updateCartItem);

//wishlist 
router.get('/wishlist',authorization, getWishlistController);
router.post('/createwishlist',authorization , addToWishlistController);
router.delete('/wishlist/:id',authorization, deleteWishlistController);






module.exports = router; 
