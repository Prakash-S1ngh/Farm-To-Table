const jwt = require('jsonwebtoken');
const setupConnection = require('../config/database.config');
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

        const { customer_id } = decoded;

        // Assuming you're looking up the user from the Customer table, not OTP
        const query = 'SELECT * FROM Customer WHERE customer_id = ?';
        const db = await setupConnection();
        const [result] = await db.execute(query, [customer_id]);

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        req.user = result[0]; // Attach the user object to the request for use in the next middleware
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
