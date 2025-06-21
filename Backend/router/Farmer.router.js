const express  = require('express');
const { createFarmer, loginFarmer, addproducts, getFarmer, getallproduct, getFarmerhistory, updateProduct, deleteProduct, updateFarmerprofile, getPendingProducts } = require('../controller/Farmer.controller');
const { FarmerAuth } = require('../middleware/FarmerAuthorization.middleware');
const upload = require('../config/multer.config');
const farmrouter = express.Router();

farmrouter.post('/createFarmer' , upload.single('image') ,createFarmer);
farmrouter.route('/farmlogin').post(loginFarmer);
farmrouter.get('/getFarmer',FarmerAuth,getFarmer);
farmrouter.get('/getpending',FarmerAuth,getPendingProducts);
farmrouter.post('/updateprofile',FarmerAuth,updateFarmerprofile);
// farmrouter.post('/imageupload',upload.single('image'),FarmerAuth,photoupload);
farmrouter.post('/addProducts',upload.single('image'),FarmerAuth,addproducts);
farmrouter.get('/getAllproducts' , getallproduct);
farmrouter.get('/gethistory' , FarmerAuth , getFarmerhistory);
farmrouter.put('/updateProduct' , FarmerAuth , updateProduct);
farmrouter.delete('/deleteProduct/:product_id', FarmerAuth, deleteProduct);





module.exports  = farmrouter ;
