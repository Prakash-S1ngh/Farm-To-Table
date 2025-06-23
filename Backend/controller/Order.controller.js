const { query } = require("express");
const { default: pool } = require("../config/test.config");

const getId = async (name) => {
  try {
    let query = 'SELECT count FROM counters WHERE name=?';
    const db = pool;
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

    const db = pool;
    await db.execute(query, [newOrderId, customerId, orderDate, total_amount, orderStatus]);

    // Insert each order detail into the order_details table
    if (Array.isArray(order_details) && order_details.length > 0) {
      const detailQuery = `
          INSERT INTO Order_Details (order_id, order_detail_id, product_id, quantity, price)
          VALUES (?, ?, ?, ?, ?)
        `;

      // Loop through the array and insert each order detail
      for (let i = 0; i < order_details.length; i++) {
        const { product_id, quantity, price } = order_details[i];
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
    const orderQuery = 'SELECT * FROM Orders WHERE customer_id=? ORDER BY order_id DESC'; // Orders by latest date first

    // Set up the database connection
    const db = pool;

    // Execute the query to get orders for the customer
    const [orderResult] = await db.execute(orderQuery, [user.customer_id]);

    // If no orders are found, send a response with a message indicating so
    if (orderResult.length === 0) {
      return res.status(404).json({
        message: "No orders found for this customer.",
      });
    }

    // Prepare to fetch order details for each order
    const orderDetailsQuery = `
        SELECT od.*, p.name , p.prodImage 
        FROM Order_Details od
        JOIN Product p ON od.product_id = p.product_id
        WHERE od.order_id = ?
      `;

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



exports.createCart = async (req, res) => {
  try {
    const { name, quantity,prodImage, price, product_ids } = req.body;
    const customer_id = req.user.customer_id;
    console.log("feilds are nothing .  ",req.body);

    if (!customer_id || !name || !product_ids?.length || !quantity || !price) {
      return res.status(400).json({ message: "All fields are required, including product_ids array." });
    }

    const db = pool;
    let quantityLeft = quantity;

    for (const item of product_ids) {
      if (quantityLeft <= 0) break;

      const { product_id, quantity } = item;
      const availableQty = quantity;

      if (!product_id || !availableQty) {
        continue; // skip invalid item
      }

      // Determine quantity to be used from this item
      const quantityToUse = Math.min(quantityLeft, availableQty);

      // Check if item already exists in cart
      const [existingItem] = await db.query(
        "SELECT quantity FROM Cart WHERE customer_id = ? AND product_id = ?",
        [customer_id, product_id]
      );

      if (existingItem.length > 0) {
        const newQuantity = existingItem[0].quantity + quantityToUse;

        await db.query(
          "UPDATE Cart SET quantity = ?, price = ? WHERE customer_id = ? AND product_id = ?",
          [newQuantity, price, customer_id, product_id]
        );
      } else {
        await db.query(
          "INSERT INTO Cart (customer_id, name, product_id, quantity, price,prodImage) VALUES (?, ?, ?, ?, ?,?)",
          [customer_id, name, product_id, quantityToUse, price, prodImage]
        );
      }

      quantityLeft -= quantityToUse;
    }

    if (quantityLeft > 0) {
      console.warn(`Warning: Not enough quantity available for ${name}. ${quantityLeft} left unfulfilled.`);
    }

    return res.status(200).json({ 
      message: "Item(s) added/updated in cart successfully",
      quantityRequested: quantity,
      quantityLeft,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating cart", error: error.message });
  }
};


exports.getCartItems = async (req, res) => {
  try {
    const user = req.user; // Get the logged-in user
    if (!user || !user.customer_id) {
      return res.status(400).json({ message: "Customer ID is missing or user is not authenticated" });
    }
    const db = pool;
    const [cartItems] = await db.query(
      "SELECT * FROM Cart WHERE customer_id = ?",
      [user.customer_id]
    );  
    if (cartItems.length === 0) {
      return res.status(404).json({ message: "No items found in cart" });
    }
    return res.status(200).json({ message: "Cart items retrieved successfully", cartItems });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving cart items", error: error.message });
  }
}; 

exports.updateCartItem = async (req, res) => {
  try {
    const {  product_id, quantity, price } = req.body;
    const { customer_id } = req.user; // Assuming customer_id is part of the authenticated user

    if (!customer_id || !product_id || quantity == null || !price) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const db = pool;
    const [existingItem] = await db.query(
      "SELECT quantity FROM Cart WHERE customer_id = ? AND product_id = ?",
      [customer_id, product_id]
    );

    if (existingItem.length === 0) {
      return res.status(404).json({ message: "Item not found in cart." });
    }

    await db.query(
      "UPDATE Cart SET quantity = ?, price = ? WHERE customer_id = ? AND product_id = ?",
      [quantity, price, customer_id, product_id]
    );

    return res.status(200).json({ message: "Cart item updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error updating cart item", error: error.message });
  }
};


exports.deleteCartItem = async (req, res) => {
  try {
    const { product_id } = req.body;
    const {customer_id} = req.user;
    
    const db = pool;
    const result = await db.query(
      "DELETE FROM Cart WHERE customer_id = ? AND product_id = ?",
      [customer_id, product_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    return res.status(200).json({ message: "Item removed from cart successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting cart item", error: error.message });
  }
};

//Wishlist functionality.

exports.getWishlistController = async (req, res) => {
  const { customer_id } = req.user; 
  const db = pool;
  try {
    const [results] = await db.execute(
      'SELECT * FROM Wishlist WHERE customer_id = ?',
      [customer_id]
    );
    res.json({ wishlist: results });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching wishlist');
  }
};

exports.addToWishlistController = async (req, res) => {
  const { customer_id  } = req.user; 
  const { items } = req.body; // Expecting items to be an array of objects
  const db = pool;
  try {
    const values = items.map(item => [item.name, item.quantity || 1, customer_id, item.description || '' , item.prodImage || '' , item.price || 0]);
    await db.query(
      'INSERT INTO Wishlist (name, quantity, customer_id,prodImage, description,price) VALUES ?',
      [values]
    );
    res.json({ message: 'Items added to wishlist' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding items to wishlist');
  }
};

exports.deleteWishlistController = async (req, res) => {
  const { id } = req.params;
  const db = pool;
  try {
    await db.execute('DELETE FROM Wishlist WHERE id = ?', [id]);
    res.json({ message: 'Item removed from wishlist' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting item from wishlist');
  }
};

