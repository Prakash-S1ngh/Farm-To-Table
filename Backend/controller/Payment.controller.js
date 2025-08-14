const { pool } = require('../config/database.config');
const razorpay = require('../config/payment.config');
const crypto = require('crypto');

// Generate unique IDs for various entities
const generateId = async (prefix) => {
  try {
    const [result] = await pool.execute('SELECT count FROM counters WHERE name = ?', [prefix]);
    if (result.length === 0) {
      throw new Error('Counter not found');
    }
    
    let count = result[0].count + 1;
    await pool.execute('UPDATE counters SET count = ? WHERE name = ?', [count, prefix]);
    return `${prefix}${count}`;
  } catch (error) {
    console.error('Error generating ID:', error);
    throw error;
  }
};

// 1. Create Razorpay Order for Payment
exports.createPaymentOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', order_id } = req.body;
    
    if (!amount || !order_id) {
      return res.status(400).json({
        success: false,
        message: 'Amount and order_id are required'
      });
    }

    const options = {
      amount: Math.round(amount * 100), // Convert to paisa
      currency,
      receipt: `receipt_${order_id}_${Date.now()}`,
      notes: {
        order_id: order_id
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);
    
    console.log('Razorpay order created:', razorpayOrder.id);
    
    res.status(200).json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      receipt: razorpayOrder.receipt
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message
    });
  }
};

// 2. Verify Payment and Update Order Status
exports.verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      order_id,
      customer_id 
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !order_id) {
      return res.status(400).json({
        success: false,
        message: 'All payment verification fields are required'
      });
    }

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Update order status to 'paid'
    await pool.execute(
      'UPDATE Orders SET status = ?, payment_id = ?, payment_date = NOW() WHERE order_id = ?',
      ['paid', razorpay_payment_id, order_id]
    );

    // Create payment record
    const payment_id = await generateId('PAY');
    await pool.execute(
      `INSERT INTO Payments (payment_id, order_id, customer_id, amount, payment_method, 
        razorpay_order_id, razorpay_payment_id, status, payment_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [payment_id, order_id, customer_id, req.body.amount, 'razorpay', 
       razorpay_order_id, razorpay_payment_id, 'completed']
    );

    // Generate receipt
    const receipt = await generateReceipt(order_id);

    console.log('Payment verified successfully for order:', order_id);
    
    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      payment_id,
      receipt
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
};

// 3. Update Inventory After Successful Order
const updateInventoryAfterOrder = async (order_id) => {
  try {
    // Get order details
    const [orderDetails] = await pool.execute(
      'SELECT product_id, quantity FROM Order_Details WHERE order_id = ?',
      [order_id]
    );

    // Update inventory quantities
    for (const detail of orderDetails) {
      await pool.execute(
        'UPDATE inventory SET quantity = quantity - ? WHERE product_id = ?',
        [detail.quantity, detail.product_id]
      );
    }

    console.log('Inventory updated for order:', order_id);
  } catch (error) {
    console.error('Error updating inventory:', error);
    throw error;
  }
};

// 4. Generate Receipt
const generateReceipt = async (order_id) => {
  try {
    const [order] = await pool.execute(
      `SELECT o.*, c.first_name, c.last_name, c.email 
       FROM Orders o 
       JOIN Customer c ON o.customer_id = c.customer_id 
       WHERE o.order_id = ?`,
      [order_id]
    );

    const [orderDetails] = await pool.execute(
      `SELECT od.*, od.product_name as name
       FROM Order_Details od 
       WHERE od.order_id = ?`,
      [order_id]
    );

    const receipt = {
      receipt_id: `RCPT${order_id}`,
      order_id: order_id,
      customer_name: `${order[0].first_name} ${order[0].last_name}`,
      customer_email: order[0].email,
      order_date: order[0].order_date,
      payment_date: order[0].payment_date,
      total_amount: order[0].total_amount,
      items: orderDetails.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.quantity * item.price
      })),
      generated_at: new Date().toISOString()
    };

    // Save receipt to database
    await pool.execute(
      `INSERT INTO Receipts (receipt_id, order_id, customer_id, receipt_data, generated_at) 
       VALUES (?, ?, ?, ?, NOW())`,
      [receipt.receipt_id, order_id, order[0].customer_id, JSON.stringify(receipt)]
    );

    return receipt;
  } catch (error) {
    console.error('Error generating receipt:', error);
    throw error;
  }
};

// 5. Get Receipt by Order ID
exports.getReceipt = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { customer_id } = req.user;

    const [receipt] = await pool.execute(
      'SELECT receipt_data FROM Receipts WHERE order_id = ? AND customer_id = ?',
      [order_id, customer_id]
    );

    if (receipt.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found'
      });
    }

    res.status(200).json({
      success: true,
      receipt: JSON.parse(receipt[0].receipt_data)
    });

  } catch (error) {
    console.error('Error fetching receipt:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch receipt',
      error: error.message
    });
  }
};

// 6. Get Payment History for Customer
exports.getPaymentHistory = async (req, res) => {
  try {
    const { customer_id } = req.user;

    const [payments] = await pool.execute(
      `SELECT p.*, o.order_id, o.total_amount, o.order_date 
       FROM Payments p 
       JOIN Orders o ON p.order_id = o.order_id 
       WHERE p.customer_id = ? 
       ORDER BY p.payment_date DESC`,
      [customer_id]
    );

    res.status(200).json({
      success: true,
      payments
    });

  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment history',
      error: error.message
    });
  }
};

// 7. Get Farmer Payment Summary
exports.getFarmerPaymentSummary = async (req, res) => {
  try {
    const { farmer_id } = req.params;

    // Get all products sold by this farmer
    const [productsSold] = await pool.execute(
      `SELECT 
        p.product_id,
        p.name,
        SUM(od.quantity) as total_quantity_sold,
        SUM(od.quantity * od.price) as total_revenue,
        i.supplier_id
       FROM Order_Details od
       JOIN inventory i ON od.product_id = i.product_id
       JOIN Product p ON od.product_id = p.product_id
       JOIN Orders o ON od.order_id = o.order_id
       WHERE i.supplier_id = ? AND o.status = 'paid'
       GROUP BY p.product_id`,
      [farmer_id]
    );

    // Calculate total earnings
    const totalEarnings = productsSold.reduce((sum, product) => sum + Number(product.total_revenue), 0);

    // Get farmer's bank details
    const [farmerDetails] = await pool.execute(
      'SELECT * FROM FarmerBankDetails WHERE farmer_id = ?',
      [farmer_id]
    );

    res.status(200).json({
      success: true,
      farmer_id,
      products_sold: productsSold,
      total_earnings: totalEarnings,
      bank_details: farmerDetails[0] || null
    });

  } catch (error) {
    console.error('Error fetching farmer payment summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch farmer payment summary',
      error: error.message
    });
  }
};

// 8. Process Farmer Payment (Admin Only)
exports.processFarmerPayment = async (req, res) => {
  try {
    const { farmer_id, amount, payment_method, reference_number } = req.body;
    const { admin_id } = req.user; // Assuming admin middleware sets this

    if (!farmer_id || !amount || !payment_method) {
      return res.status(400).json({
        success: false,
        message: 'Farmer ID, amount, and payment method are required'
      });
    }

    // Verify farmer exists and has earnings
    const [farmerSummary] = await pool.execute(
      `SELECT 
        SUM(od.quantity * od.price) as total_earnings
       FROM Order_Details od
       JOIN inventory i ON od.product_id = i.product_id
       JOIN Orders o ON od.order_id = o.order_id
       WHERE i.supplier_id = ? AND o.status = 'paid'`,
      [farmer_id]
    );

    const totalEarnings = Number(farmerSummary[0].total_earnings) || 0;

    if (amount > totalEarnings) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount cannot exceed total earnings'
      });
    }

    // Create farmer payment record
    const payment_id = await generateId('FPAY');
    await pool.execute(
      `INSERT INTO FarmerPayments (payment_id, farmer_id, admin_id, amount, 
        payment_method, reference_number, payment_date, status) 
       VALUES (?, ?, ?, ?, ?, ?, NOW(), 'completed')`,
      [payment_id, farmer_id, admin_id, amount, payment_method, reference_number]
    );

    // Mark related orders as 'farmer_paid'
    await pool.execute(
      `UPDATE Orders o 
       JOIN Order_Details od ON o.order_id = od.order_id 
       JOIN inventory i ON od.product_id = i.product_id 
       SET o.farmer_payment_status = 'paid' 
       WHERE i.supplier_id = ? AND o.status = 'paid'`,
      [farmer_id]
    );

    console.log('Farmer payment processed successfully:', payment_id);

    res.status(200).json({
      success: true,
      message: 'Farmer payment processed successfully',
      payment_id,
      amount,
      farmer_id
    });

  } catch (error) {
    console.error('Error processing farmer payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process farmer payment',
      error: error.message
    });
  }
};

// 9. Get All Farmer Payments (Admin Only)
exports.getAllFarmerPayments = async (req, res) => {
  try {
    const [payments] = await pool.execute(
      `SELECT 
        fp.*,
        CONCAT(s.first_name, ' ', s.last_name) as farmer_name,
        s.email as farmer_email
       FROM FarmerPayments fp
       JOIN suppliers s ON fp.farmer_id = s.id
       ORDER BY fp.payment_date DESC`
    );

    res.status(200).json({
      success: true,
      payments
    });

  } catch (error) {
    console.error('Error fetching farmer payments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch farmer payments',
      error: error.message
    });
  }
};

// 10. Get Order Status
exports.getOrderStatus = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { customer_id } = req.user;

    const [order] = await pool.execute(
      `SELECT o.*, p.payment_id, p.status as payment_status, p.payment_date
       FROM Orders o 
       LEFT JOIN Payments p ON o.order_id = p.order_id 
       WHERE o.order_id = ? AND o.customer_id = ?`,
      [order_id, customer_id]
    );

    if (order.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      order: order[0]
    });

  } catch (error) {
    console.error('Error fetching order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order status',
      error: error.message
    });
  }
};