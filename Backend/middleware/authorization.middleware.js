const jwt = require('jsonwebtoken');
const { pool } = require('../config/database.config');
require('dotenv').config();

exports.authorization = async (req, res, next) => {
    try {
        console.log("hi bro");

        const { token } = req.cookies; // Get the token from cookies
        console.log("User ka token ",token);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token not found in cookie"
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY); // Verify the token
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
                error:error.message
            });
        }
        
        req.user = {
            customer_id: decoded.customer_id
        };
        next(); // Proceed to the next middleware

    } catch (error) {
        console.error("Authorization error:", error);
        return res.status(500).json({
            success: false,
            message: "Authorization middleware failed",
            error: error.message
        });
    }
};
