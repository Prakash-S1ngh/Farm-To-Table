const Paymentrouter = require('express').Router();
const { createPaymentOrder , verifyPayment } = require('../controller/Payment.controller');

Paymentrouter.post('/create-order', createPaymentOrder);
Paymentrouter.post('/verify', verifyPayment);

module.exports = Paymentrouter;