const express  = require('express');
const { createFarmer, loginFarmer, AddressforFarmer, photoupload, addproducts, getFarmer, getallproduct, getFarmerhistory } = require('../controller/Farmer.controller');
const { FarmerAuth } = require('../middleware/FarmerAuthorization.middleware');
const upload = require('../config/multer.config');
const farmrouter = express.Router();

farmrouter.route('/createFarmer').post(createFarmer);
farmrouter.route('/farmlogin').post(loginFarmer);
farmrouter.get('/getFarmer',FarmerAuth,getFarmer);
farmrouter.post('/farmAddress',FarmerAuth,AddressforFarmer);
farmrouter.post('/imageupload',upload.single('image'),FarmerAuth,photoupload);
farmrouter.post('/addProducts',upload.single('image'),FarmerAuth,addproducts);
farmrouter.get('/getAllproducts' , getallproduct);
farmrouter.get('/gethistory' , FarmerAuth , getFarmerhistory);



module.exports  = farmrouter ;
