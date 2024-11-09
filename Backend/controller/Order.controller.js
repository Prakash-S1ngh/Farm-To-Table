const { query } = require("express");
const setupConnection = require("../config/database.config");

const getId = async (name) => {
  try {
    let query = 'SELECT count FROM counters WHERE name=?';
    const db = await setupConnection();
    const [result] = await db.execute(query, [name]);

    if (result.length === 0) {
      throw new Error('Counter not found');
    }

    let count = result[0].count + 1;  // Increment the count
    query = 'UPDATE counters SET count = ? WHERE name = ?';  // Update counter value
    await db.execute(query, [count, name]);

    return `${name}${count}`; // Generate order_id like name1, name2, etc.
  } catch (error) {
    console.log("An error occurred in generating order_id:", error.message);
    throw error; // Rethrow the error for the caller to handle it
  }
}


exports.createOrder = async (req, res) => {
    try {
      const user = req.user;  // Get the user from the request object (assuming it's set via middleware)
      const { total_amount, order_details } = req.body;  // Assuming order_details is an array
      
      // If customer_id is not passed in the body, use the one from the logged-in user
      const customerId = user.customer_id;
  
      // Get current date for the order
      const orderDate = new Date().toISOString().split('T')[0];
  // Date in ISO format

  
      // Default status for a new order
      const orderStatus = "pending";
  
      // Generate a new order_id
      const newOrderId = await getId('ORD');  // Assume 'order' is the counter name for order IDs
  
      // Insert the order into the database
      const query = `
        INSERT INTO Orders (order_id, customer_id, order_date, total_amount, status)
        VALUES (?, ?, ?, ?, ?)
      `;
  
      const db = await setupConnection();
      await db.execute(query, [newOrderId, customerId, orderDate, total_amount, orderStatus]);
  
      // Insert each order detail into the order_details table
      if (Array.isArray(order_details) && order_details.length > 0) {
        const detailQuery = `
          INSERT INTO Order_Details (order_id, order_detail_id, product_id, quantity, price)
          VALUES (?, ?, ?, ?, ?)
        `;
  
        // Loop through the array and insert each order detail
        for (let i = 0; i < order_details.length; i++) {
          const {  product_id, quantity, price } = order_details[i];
          const order_detail_id = await getId('ORD_DET')
          await db.execute(detailQuery, [newOrderId, order_detail_id, product_id, quantity, price]);
        }
      }
  
      // Respond with a success message and order details
      res.status(201).json({
        message: "Order created successfully",
        orderId: newOrderId,
        customerId,
        status: orderStatus,
      });
  
    } catch (error) {
      console.log("Error creating order:", error.message);
      res.status(500).json({ message: "Error creating order", error: error.message });
    }
  }

  exports.getOrders = async (req, res) => {
    try {
      const user = req.user; // Get the logged-in user
  
      // Check if the user is authenticated and if user.customer_id exists
      if (!user || !user.customer_id) {
        return res.status(400).json({
          message: "Customer ID is missing or user is not authenticated",
        });
      }
  
      // Define the query to get orders for the customer
      const orderQuery = 'SELECT * FROM Orders WHERE customer_id=?';
      
      // Set up the database connection
      const db = await setupConnection();
  
      // Execute the query to get orders for the customer
      const [orderResult] = await db.execute(orderQuery, [user.customer_id]);
  
      // If no orders are found, send a response with a message indicating so
      if (orderResult.length === 0) {
        return res.status(404).json({
          message: "No orders found for this customer.",
        });
      }
  
      // Prepare to fetch order details for each order
      const orderDetailsQuery = 'SELECT * FROM Order_Details WHERE order_id=?';
  
      // Iterate over each order and fetch its details
      for (let order of orderResult) {
        const [details] = await db.execute(orderDetailsQuery, [order.order_id]);
        order.details = details; // Add the details array to the order object
      }
  
      // Return the orders with their details in the response
      return res.status(200).json({
        message: "Orders retrieved successfully",
        orders: orderResult,
      });
  
    } catch (error) {
      console.log("Error retrieving orders:", error.message);
      return res.status(500).json({
        message: "Error retrieving orders",
        error: error.message,
      });
    }
  };
  