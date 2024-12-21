const express = require('express');
const { getAllUsers, deleteUser, getAllSuppliers, deleteSupplier, getInventory, getItems, approve, getrevenue, gettotalorders, gettotalcustomers, getRecentOrders, gettotalproducts } = require('../controller/admin.controller');
const adminrouter = express.Router();

adminrouter.get('/allUsers',getAllUsers);
adminrouter.delete('/delUsers/:customer_id', deleteUser);
adminrouter.delete('/delSuppliers/:supplier_id', deleteSupplier);
adminrouter.get('/getAllfarmer',getAllSuppliers);
adminrouter.get('/Inventory',getInventory);
adminrouter.get('/AddItems',getItems);
adminrouter.post('/approve',approve);
adminrouter.get('/getProfits',getrevenue);
adminrouter.get('/gettotaloders',gettotalorders);
adminrouter.get('/gettotalitems',gettotalproducts);
adminrouter.get('/gettotalCustomer',gettotalcustomers);
adminrouter.get('/getRecent',getRecentOrders);



module.exports = adminrouter;