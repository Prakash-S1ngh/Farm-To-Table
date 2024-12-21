const jwt = require('jsonwebtoken');
const {setupConnection} = require('../config/database.config');
require('dotenv').config();

exports.FarmerAuth = async (req, res, next) => {
    try {
        console.log("This is a farmauthorization");

        const { token } = req.cookies; 
        console.log("farmer ka token",token);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token not found in cookie"
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY); 
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }

        const {id } = decoded;

        // Assuming you're looking up the user from the supplier table
        const query = 'SELECT * FROM suppliers WHERE id = ?';
        const db = await setupConnection();
        const [result] = await db.execute(query, [id]);

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Farmer not found"
            });
        }

        req.Farmer = result[0]; // Attach the user object to the request for use in the next middleware
        console.log("The farmer is ",req.Farmer);
        next(); // Proceed to the next middleware

    } catch (error) {
        console.error("Authorization of farmer error:", error);
        return res.status(500).json({
            success: false,
            message: "Authorization middleware failed",
            error: error.message
        });
    }
};
