const { query } = require("express");
const { pool } = require("../config/database.config");

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
  let connection;
  try {
    const user = req.user;
    const { total_amount, order_details } = req.body;
    const customerId = user.customer_id;

    if (!total_amount || !order_details || !Array.isArray(order_details) || order_details.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Total amount and order details array are required"
      });
    }

    const orderDate = new Date().toISOString().split('T')[0];
    const orderStatus = "pending";
    const newOrderId = await getId('ORD');

    // Get connection from pool
    connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 1. Insert into Orders table
      const orderQuery = `
        INSERT INTO Orders (order_id, customer_id, order_date, total_amount, status)
        VALUES (?, ?, ?, ?, ?)
      `;
      await connection.execute(orderQuery, [newOrderId, customerId, orderDate, total_amount, orderStatus]);

      // 2. Insert each order detail
      const detailQuery = `
        INSERT INTO Order_Details (order_detail_id, order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?, ?)
      `;

      for (let i = 0; i < order_details.length; i++) {
        const { name, quantity, price } = order_details[i];

        // Fetch product_id and stock from Product table
        const [productRows] = await connection.execute(
          'SELECT product_id, stock FROM Product WHERE name = ?',
          [name]
        );

        if (productRows.length === 0) {
          throw new Error(`Product "${name}" not found in database`);
        }

        const product_id = productRows[0].product_id;
        const currentStock = productRows[0].stock;

        if (quantity > currentStock) {
          throw new Error(`Insufficient stock for product "${name}"`);
        }

        // Insert into Order_Details
        const order_detail_id = await getId('ORD_DET');
        await connection.execute(detailQuery, [
          order_detail_id,
          newOrderId,
          product_id,
          quantity,
          price
        ]);

        // Update Product stock
        await connection.execute(
          'UPDATE Product SET stock = stock - ? WHERE product_id = ?',
          [quantity, product_id]
        );

        // Optionally update Inventory table too (if separate)
        await connection.execute(
          'UPDATE Inventory SET quantity = quantity - ? WHERE product_id = ?',
          [quantity, product_id]
        );
      }

      // 3. Clear Cart
      await connection.execute('DELETE FROM Cart WHERE customer_id = ?', [customerId]);

      // Commit transaction
      await connection.commit();

      res.status(201).json({
        success: true,
        message: "Order created successfully",
        orderId: newOrderId,
        customerId,
        status: orderStatus,
        total_amount,
        items_count: order_details.length
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    }

  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message
    });
  } finally {
    if (connection) connection.release();
  }
};

exports.getOrders = async (req, res) => {
  try {
    const user = req.user;

    if (!user || !user.customer_id) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is missing or user is not authenticated",
      });
    }

    const orderQuery = 'SELECT * FROM Orders WHERE customer_id = ? ORDER BY order_date DESC, order_id DESC';
    const db = pool;
    const [orderResult] = await db.execute(orderQuery, [user.customer_id]);

    if (orderResult.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No orders found for this customer.",
        orders: []
      });
    }

    // Fetch order details for each order (using product_name instead of product_id)
    const orderDetailsQuery = `
      SELECT od.*, od.product_name as name
      FROM Order_Details od
      WHERE od.order_id = ?
    `;

    for (let order of orderResult) {
      const [details] = await db.execute(orderDetailsQuery, [order.order_id]);
      order.details = details;
    }

    return res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      orders: orderResult,
    });

  } catch (error) {
    console.error("Error retrieving orders:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error retrieving orders",
      error: error.message,
    });
  }
};



exports.createCart = async (req, res) => {
  try {
    const { name, quantity, prodImage, price } = req.body;
    const customer_id = req.user.customer_id;
    console.log("Cart creation fields:", req.body);

    if (!customer_id || !name || !quantity || !price) {
      return res.status(400).json({ 
        success: false,
        message: "Customer ID, name, quantity, and price are required." 
      });
    }

    const db = pool;

    // Check if item already exists in cart for this customer and product name
    const [existingItem] = await db.query(
      "SELECT quantity FROM Cart WHERE customer_id = ? AND name = ?",
      [customer_id, name]
    );

    if (existingItem.length > 0) {
      // Update existing cart item quantity
      const newQuantity = existingItem[0].quantity + quantity;
      await db.query(
        "UPDATE Cart SET quantity = ?, price = ? WHERE customer_id = ? AND name = ?",
        [newQuantity, price, customer_id, name]
      );
      console.log('Updated existing cart item quantity for:', name);
    } else {
      // Insert new cart item
      await db.query(
        "INSERT INTO Cart (customer_id, name, quantity, price, prodImage) VALUES (?, ?, ?, ?, ?)",
        [customer_id, name, quantity, price, prodImage]
      );
      console.log('Created new cart item:', name);
    }

    return res.status(200).json({ 
      success: true,
      message: "Item added/updated in cart successfully"
    });
  } catch (error) {
    console.error('Error creating cart:', error);
    return res.status(500).json({ 
      success: false,
      message: "Error creating cart", 
      error: error.message 
    });
  }
};

exports.getCartItems = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.customer_id) {
      return res.status(400).json({ 
        success: false,
        message: "Customer ID is missing or user is not authenticated" 
      });
    }
    
    const db = pool;
    const [cartItems] = await db.query(
      "SELECT * FROM Cart WHERE customer_id = ? ORDER BY created_at DESC",
      [user.customer_id]
    );  
    
    if (cartItems.length === 0) {
      return res.status(200).json({ 
        success: true,
        message: "Cart is empty", 
        cartItems: [] 
      });
    }
    
    return res.status(200).json({ 
      success: true,
      message: "Cart items retrieved successfully", 
      cartItems 
    });
  } catch (error) {
    console.error('Error retrieving cart items:', error);
    return res.status(500).json({ 
      success: false,
      message: "Error retrieving cart items", 
      error: error.message 
    });
  }
}; 

exports.updateCartItem = async (req, res) => {
  try {
    const { name, quantity, price } = req.body;
    const { customer_id } = req.user;

    if (!customer_id || !name || quantity == null || !price) {
      return res.status(400).json({ 
        success: false,
        message: "Customer ID, name, quantity, and price are required." 
      });
    }

    const db = pool;
    
    // Check if item exists in cart
    const [existingItem] = await db.query(
      "SELECT quantity FROM Cart WHERE customer_id = ? AND name = ?",
      [customer_id, name]
    );

    if (existingItem.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Item not found in cart." 
      });
    }

    // Update the cart item
    await db.query(
      "UPDATE Cart SET quantity = ?, price = ? WHERE customer_id = ? AND name = ?",
      [quantity, price, customer_id, name]
    );

    return res.status(200).json({ 
      success: true,
      message: "Cart item updated successfully" 
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return res.status(500).json({ 
      success: false,
      message: "Error updating cart item", 
      error: error.message 
    });
  }
};

exports.deleteCartItem = async (req, res) => {
  try {
    const { name } = req.params;
    const { customer_id } = req.user;
    
    if (!name) {
      return res.status(400).json({ 
        success: false,
        message: "Product name is required" 
      });
    }
    
    const db = pool;
    
    // First check if the item exists in cart
    const [existingItem] = await db.query(
      "SELECT * FROM Cart WHERE customer_id = ? AND name = ?",
      [customer_id, name]
    );

    if (existingItem.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Item not found in cart" 
      });
    }

    // Delete the item
    const [result] = await db.query(
      "DELETE FROM Cart WHERE customer_id = ? AND name = ?",
      [customer_id, name]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Item not found in cart" 
      });
    }

    return res.status(200).json({ 
      success: true,
      message: "Item removed from cart successfully" 
    });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    return res.status(500).json({ 
      success: false,
      message: "Error deleting cart item", 
      error: error.message 
    });
  }
};

// Add wishlist item to cart
exports.addWishlistItemToCart = async (req, res) => {
  try {
    const { customer_id } = req.user;
    const { name, quantity, price, prodImage } = req.body;
    
    if (!customer_id || !name || !quantity || !price) {
      return res.status(400).json({ 
        success: false,
        message: "Name, quantity, and price are required" 
      });
    }

    const db = pool;
    
    // Check if item already exists in cart for this customer and product name
    const [existingCart] = await db.query(
      "SELECT * FROM Cart WHERE customer_id = ? AND name = ?",
      [customer_id, name]
    );

    if (existingCart.length > 0) {
      // Update existing cart item quantity
      const newQuantity = existingCart[0].quantity + quantity;
      await db.query(
        "UPDATE Cart SET quantity = ?, price = ? WHERE customer_id = ? AND name = ?",
        [newQuantity, price, customer_id, name]
      );
      
      console.log('Updated existing cart quantity for customer:', customer_id, 'product:', name);
    } else {
      // Insert new cart item with all available fields
      await db.query(
        "INSERT INTO Cart (customer_id, name, quantity, price, prodImage) VALUES (?, ?, ?, ?, ?)",
        [customer_id, name, quantity, price, prodImage]
      );
      
      console.log('Created new cart item for customer:', customer_id, 'product:', name);
    }

    console.log('Successfully added wishlist item to cart:', name);
    return res.status(200).json({ 
      success: true,
      message: "Item added to cart successfully"
    });
    
  } catch (error) {
    console.error('Error adding wishlist item to cart:', error);
    return res.status(500).json({ 
      success: false,
      message: "Error adding item to cart", 
      error: error.message 
    });
  }
};

// Clear cart after order creation
exports.clearCart = async (req, res) => {
  try {
    const { customer_id } = req.user;
    
    if (!customer_id) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is required"
      });
    }

    const db = pool;
    const [result] = await db.execute('DELETE FROM Cart WHERE customer_id = ?', [customer_id]);

    console.log('Cart cleared for customer:', customer_id, 'Items removed:', result.affectedRows);

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      items_removed: result.affectedRows
    });

  } catch (error) {
    console.error('Error clearing cart:', error);
    return res.status(500).json({
      success: false,
      message: "Error clearing cart",
      error: error.message
    });
  }
};

// Get order status
exports.getOrderStatus = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { customer_id } = req.user;

    if (!order_id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required"
      });
    }

    const db = pool;
    const [order] = await db.execute(
      `SELECT o.*, p.payment_id, p.status as payment_status, p.payment_date
       FROM Orders o 
       LEFT JOIN Payments p ON o.order_id = p.order_id 
       WHERE o.order_id = ? AND o.customer_id = ?`,
      [order_id, customer_id]
    );

    if (order.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Get order details
    const [orderDetails] = await db.execute(
      'SELECT * FROM Order_Details WHERE order_id = ?',
      [order_id]
    );

    const orderData = {
      ...order[0],
      details: orderDetails
    };

    return res.status(200).json({
      success: true,
      message: "Order status retrieved successfully",
      order: orderData
    });

  } catch (error) {
    console.error('Error fetching order status:', error);
    return res.status(500).json({
      success: false,
      message: "Error fetching order status",
      error: error.message
    });
  }
};

//Wishlist functionality.

exports.getWishlistController = async (req, res) => {
  const { customer_id } = req.user; 
  const db = pool;
  try {
    console.log('Fetching wishlist for customer:', customer_id);
    
    const [results] = await db.execute(
      'SELECT * FROM Wishlist WHERE customer_id = ?',
      [customer_id]
    );
    
    console.log('Wishlist results:', results);
    console.log('Number of items in wishlist:', results.length);
    
    res.json({ 
      success: true,
      wishlist: results,
      count: results.length 
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching wishlist',
      error: error.message 
    });
  }
};

// exports.addToWishlistController = async (req, res) => {
//   const { customer_id } = req.user; 
//   const { items } = req.body; // Expecting items to be an array of objects with product_id

//   const db = pool;

//   try {
//     console.log('Adding items to wishlist for customer:', customer_id);
//     console.log('Items to add:', items);

//     if (!items || !Array.isArray(items) || items.length === 0) {
//       return res.status(400).json({ message: 'No items provided to add to wishlist.' });
//     }

//     // Map items to match the column order: product_id, name, quantity, customer_id, description, prodImage, price
//     const values = items.map(item => [
//       item.product_id,       // <-- added product_id here
//       item.name, 
//       item.quantity || 1, 
//       customer_id, 
//       item.description || '', 
//       item.prodImage || '', 
//       item.price || 0
//     ]);

//     // Create placeholders for each item (7 columns now)
//     const placeholders = items.map(() => '(?, ?, ?, ?, ?, ?, ?)').join(', ');
//     // Flatten the values array
//     const flattenedValues = values.flat();

//     const sql = `INSERT INTO Wishlist 
//       (product_id, name, quantity, customer_id, description, prodImage, price) 
//       VALUES ${placeholders}`;

//     await db.execute(sql, flattenedValues);

//     console.log('Items successfully added to wishlist');
//     return res.json({ message: 'Items added to wishlist' });

//   } catch (error) {
//     console.error('Error adding items to wishlist:', error);
//     res.status(500).json({ 
//       message: 'Error adding items to wishlist',
//       error: error.message 
//     });
//   }
// };

exports.addToWishlistController = async (req, res) => {
  const { customer_id } = req.user; 
  const { items } = req.body; 

  const db = pool;

  try {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items provided to add to wishlist.' });
    }

    const values = items.map(item => [
      item.name,
      item.quantity || 1,
      customer_id,
      item.description || '',
      item.prodImage || '',
      item.price || 0
    ]);

    const placeholders = items.map(() => '(?, ?, ?, ?, ?, ?)').join(', ');
    const flattenedValues = values.flat();

    const sql = `
      INSERT INTO Wishlist (name, quantity, customer_id, description, prodImage, price)
      VALUES ${placeholders}
      ON DUPLICATE KEY UPDATE
        quantity = VALUES(quantity),
        description = VALUES(description),
        prodImage = VALUES(prodImage),
        price = VALUES(price)
    `;

    const [result] = await db.execute(sql, flattenedValues);

    return res.json({ 
      message: `${result.affectedRows} item(s) inserted or updated in wishlist.` 
    });

  } catch (error) {
    console.error('Error adding items to wishlist:', error);
    res.status(500).json({ 
      message: 'Error adding items to wishlist',
      error: error.message 
    });
  }
};


exports.deleteWishlistController = async (req, res) => {
  const { name } = req.params;
  const { customer_id } = req.user;
  const db = pool;
  try {
    console.log('Deleting wishlist item:', name, 'for customer:', customer_id);
    
    // Add customer_id check for security - users can only delete their own wishlist items
    const [result] = await db.execute(
      'DELETE FROM Wishlist WHERE customer_id = ? AND name = ?', 
      [customer_id, name]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Wishlist item not found or not authorized to delete' 
      });
    }
    
    return res.json({ 
      success: true,
      message: 'Item removed from wishlist' 
    });
  } catch (error) {
    console.error('Error deleting item from wishlist:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error deleting item from wishlist',
      error: error.message 
    });
  }
};

