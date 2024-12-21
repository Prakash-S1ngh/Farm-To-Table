const jwt = require('jsonwebtoken');

exports.adminAuthorization = async (req, res, next) => {
    try {
        // Extract the token from cookies
        const token = req.cookies.admin;

        // Check if the token is provided
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authorization required. No token provided.",
            });
        }

        // Verify the token
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: "Invalid or expired token.",
                });
            }

            // Attach admin data to the request object for further use
            req.admin = decoded;
            next(); // Proceed to the next middleware or route handler
        });
    } catch (error) {
      
        return res.status(500).json({
            success: false,
            message: "An error occurred while authorizing the admin.",
            error:error.message
        });
    }
};
