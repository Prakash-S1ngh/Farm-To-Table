const express  = require('express');
const { createFarmer, loginFarmer, AddressforFarmer,  addproducts, getFarmer, getallproduct, getFarmerhistory, updateProduct, deleteProduct } = require('../controller/Farmer.controller');
const { FarmerAuth } = require('../middleware/FarmerAuthorization.middleware');
const upload = require('../config/multer.config');
const farmrouter = express.Router();

farmrouter.route('/createFarmer').post( upload.single('image') ,createFarmer);
farmrouter.route('/farmlogin').post(loginFarmer);
farmrouter.get('/getFarmer',FarmerAuth,getFarmer);
farmrouter.post('/farmAddress',FarmerAuth,AddressforFarmer);
// farmrouter.post('/imageupload',upload.single('image'),FarmerAuth,photoupload);
farmrouter.post('/addProducts',upload.single('image'),FarmerAuth,addproducts);
farmrouter.get('/getAllproducts' , getallproduct);
farmrouter.get('/gethistory' , FarmerAuth , getFarmerhistory);
farmrouter.put('/updateProduct' , FarmerAuth , updateProduct);
farmrouter.delete('/deleteProduct/:product_id', FarmerAuth, deleteProduct);





module.exports  = farmrouter ;
