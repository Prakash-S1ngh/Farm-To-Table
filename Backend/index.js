const express = require('express');
const router = require('./router/User.router');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const farmrouter = require('./router/Farmer.router');
const adminrouter  = require('./Admin/Routes/User.router');
require('dotenv').config();
const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// CORS configuration
const corsOptions = {
    origin: 'http://localhost:3000', // Specify the frontend's origin
    credentials: true, // Allow credentials (cookies, etc.)
  };
  
  app.use(cors(corsOptions));

// // Database Connection
// const connection = setupConnection(); // Ensure you handle the connection properly

app.get('/', (req, res) => {
    return res.send(`<h1>The server is running</h1>`);
});

app.use('/users/api/v2', router);
app.use('/farmers/api/v2',farmrouter);
app.use('/adminpanel/api/v2',adminrouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging
    res.status(500).json({
        success: false,
        message: "An internal server error occurred.",
        error: err.message // Include the error message (omit in production)
    });
});

const PORT = process.env.PORT_NUM || 5000; // Set a default port if not provided

app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
});
