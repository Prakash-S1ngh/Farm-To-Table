const express  = require('express');
const multer = require('multer');
const { createFarmer, loginFarmer, addproducts, getFarmer, getallproduct, getFarmerhistory, updateProduct, deleteProduct, updateFarmerprofile, getPendingProducts, getProductById, getAllProducts, getProductsByStatus, getProductStats } = require('../controller/Farmer.controller');
const { FarmerAuth } = require('../middleware/FarmerAuthorization.middleware');
const upload = require('../config/multer.config');
const farmrouter = express.Router();

farmrouter.post('/createFarmer' , upload.single('image') , (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error("Multer error:", err);
    return res.status(400).json({ message: "File upload error: " + err.message });
  } else if (err) {
    console.error("Other error:", err);
    return res.status(400).json({ message: err.message });
  }
  
  // Log file information
  console.log("File upload middleware - req.file:", req.file);
  console.log("File upload middleware - req.body:", req.body);
  
  next();
}, createFarmer);
farmrouter.route('/farmlogin').post(loginFarmer);
farmrouter.get('/getFarmer',FarmerAuth,getFarmer);
farmrouter.get('/getpending',FarmerAuth,getPendingProducts);
farmrouter.get('/products',FarmerAuth,getAllProducts);
farmrouter.get('/products/status/:status',FarmerAuth,getProductsByStatus);
farmrouter.get('/products/stats',FarmerAuth,getProductStats);
farmrouter.get('/product/:productId',FarmerAuth,getProductById);
farmrouter.post('/updateprofile',FarmerAuth,updateFarmerprofile);
// farmrouter.post('/imageupload',upload.single('image'),FarmerAuth,photoupload);
farmrouter.post('/addProducts',upload.single('image'),FarmerAuth,addproducts);
farmrouter.get('/getAllproducts' , getallproduct);
farmrouter.get('/gethistory' , FarmerAuth , getFarmerhistory);
farmrouter.put('/updateProduct', upload.single('image'), (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error("Multer error:", err);
    return res.status(400).json({ message: "File upload error: " + err.message });
  } else if (err) {
    console.error("Other error:", err);
    return res.status(400).json({ message: err.message });
  }
  
  // Log file information
  console.log("Update product file upload middleware - req.file:", req.file);
  console.log("Update product file upload middleware - req.body:", req.body);
  
  next();
}, FarmerAuth, updateProduct);
farmrouter.delete('/deleteProduct/:product_id', FarmerAuth, deleteProduct);





module.exports  = farmrouter ;
