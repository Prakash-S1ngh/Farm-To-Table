require('dotenv').config();

const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

module.exports = razorpay;


exports.instance = {
    key_id: process.env.RAZORPAY_KEY_ID, // Replace with your Razorpay Key ID
    key_secret: process.env.RAZORPAY_KEY_SECRET // Replace with your Razorpay Key Secret
}

