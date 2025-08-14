const { pool } = require("../config/database.config");

// Submit contact form
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, user_type, subject, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required"
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address"
      });
    }

    const db = pool;
    
    // Insert contact message
    const insertQuery = `
      INSERT INTO contact_messages (name, email, phone, user_type, subject, message)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.execute(insertQuery, [
      name, 
      email, 
      phone || null, 
      user_type || 'guest', 
      subject || 'General Inquiry', 
      message
    ]);


    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully. We'll get back to you soon!",
      contact_id: result.insertId
    });

  } catch (error) {
    console.error("Error submitting contact form:", error.message);
    res.status(500).json({
      success: false,
      message: "Error submitting contact form",
      error: error.message
    });
  }
};

// Get all contact messages (admin only)
exports.getAllContactMessages = async (req, res) => {
  try {
    const db = pool;
    
    const query = `
      SELECT * FROM contact_messages 
      ORDER BY 
        CASE 
          WHEN priority = 'urgent' THEN 1
          WHEN priority = 'high' THEN 2
          WHEN priority = 'medium' THEN 3
          WHEN priority = 'low' THEN 4
        END,
        created_at DESC
    `;
    
    const [messages] = await db.execute(query);

    res.status(200).json({
      success: true,
      message: "Contact messages retrieved successfully",
      messages,
      total: messages.length
    });

  } catch (error) {
    console.error("Error retrieving contact messages:", error.message);
    res.status(500).json({
      success: false,
      message: "Error retrieving contact messages",
      error: error.message
    });
  }
};

// Get contact message by ID
exports.getContactMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = pool;
    
    const [messages] = await db.execute(
      'SELECT * FROM contact_messages WHERE id = ?',
      [id]
    );

    if (messages.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact message retrieved successfully",
      message: messages[0]
    });

  } catch (error) {
    console.error("Error retrieving contact message:", error.message);
    res.status(500).json({
      success: false,
      message: "Error retrieving contact message",
      error: error.message
    });
  }
};

// Update contact message status
exports.updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, admin_notes } = req.body;
    const db = pool;
    
    // Check if message exists
    const [existing] = await db.execute(
      'SELECT * FROM contact_messages WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found"
      });
    }

    // Update message
    const updateQuery = `
      UPDATE contact_messages 
      SET status = ?, priority = ?, admin_notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    await db.execute(updateQuery, [status, priority, admin_notes, id]);

    res.status(200).json({
      success: true,
      message: "Contact message status updated successfully"
    });

  } catch (error) {
    console.error("Error updating contact message status:", error.message);
    res.status(500).json({
      success: false,
      message: "Error updating contact message status",
      error: error.message
    });
  }
};

// Reply to contact message
exports.replyToContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { response_message } = req.body;
    const db = pool;
    
    if (!response_message) {
      return res.status(400).json({
        success: false,
        message: "Response message is required"
      });
    }

    // Check if message exists
    const [existing] = await db.execute(
      'SELECT * FROM contact_messages WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found"
      });
    }

    // Update message with response
    const updateQuery = `
      UPDATE contact_messages 
      SET response_message = ?, response_date = CURRENT_TIMESTAMP, status = 'replied', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    await db.execute(updateQuery, [response_message, id]);

    res.status(200).json({
      success: true,
      message: "Response sent successfully"
    });

  } catch (error) {
    console.error("Error replying to contact message:", error.message);
    res.status(500).json({
      success: false,
      message: "Error sending response",
      error: error.message
    });
  }
};

// Delete contact message
exports.deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const db = pool;
    
    const [result] = await db.execute(
      'DELETE FROM contact_messages WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact message deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting contact message:", error.message);
    res.status(500).json({
      success: false,
      message: "Error deleting contact message",
      error: error.message
    });
  }
};

// Get contact statistics for dashboard
exports.getContactStats = async (req, res) => {
  try {
    const db = pool;
    
    // Get counts by status
    const [statusCounts] = await db.execute(`
      SELECT status, COUNT(*) as count 
      FROM contact_messages 
      GROUP BY status
    `);
    
    // Get counts by priority
    const [priorityCounts] = await db.execute(`
      SELECT priority, COUNT(*) as count 
      FROM contact_messages 
      GROUP BY priority
    `);
    
    // Get total count
    const [totalResult] = await db.execute('SELECT COUNT(*) as total FROM contact_messages');
    
    // Get recent messages count (last 7 days)
    const [recentResult] = await db.execute(`
      SELECT COUNT(*) as recent 
      FROM contact_messages 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `);

    const stats = {
      total: totalResult[0].total,
      recent: recentResult[0].recent,
      byStatus: statusCounts,
      byPriority: priorityCounts
    };

    res.status(200).json({
      success: true,
      message: "Contact statistics retrieved successfully",
      stats
    });

  } catch (error) {
    console.error("Error retrieving contact statistics:", error.message);
    res.status(500).json({
      success: false,
      message: "Error retrieving contact statistics",
      error: error.message
    });
  }
};
