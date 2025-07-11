const Paymentrouter = require('express').Router();
const { createOrder , verifyPayment } = require('../controller/Payment.controller');

Paymentrouter.post('/create-order', createOrder);
Paymentrouter.post('/verify', verifyPayment);

module.exports = Paymentrouter;