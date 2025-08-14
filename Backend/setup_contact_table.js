const { pool } = require('./config/database.config');

const createContactTable = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Create contact_messages table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        user_type ENUM('customer', 'farmer', 'guest', 'admin') DEFAULT 'guest',
        subject VARCHAR(200) DEFAULT 'General Inquiry',
        message TEXT NOT NULL,
        status ENUM('new', 'read', 'replied', 'resolved') DEFAULT 'new',
        priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        admin_notes TEXT,
        response_message TEXT,
        response_date TIMESTAMP NULL
      )
    `;
    
    await connection.execute(createTableQuery);
    console.log('✅ Contact messages table created successfully!');
    
    // Create indexes for better performance
    const createIndexes = [
      'CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_messages(status)',
      'CREATE INDEX IF NOT EXISTS idx_contact_user_type ON contact_messages(user_type)',
      'CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact_messages(created_at)'
    ];
    
    for (const indexQuery of createIndexes) {
      try {
        await connection.execute(indexQuery);
      } catch (error) {
        // Index might already exist, that's okay
        console.log('Index creation skipped (might already exist)');
      }
    }
    
    console.log('✅ Contact table setup completed!');
    connection.release();
    
  } catch (error) {
    console.error('❌ Error setting up contact table:', error.message);
    process.exit(1);
  }
};

// Run the setup
createContactTable();
