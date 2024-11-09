const mysql = require('mysql2/promise'); // Assuming you're using mysql2
const setupConnection = require('./database.config');

exports.generateCustomerId = async ()=> {
    // Create a database connection
    const db = await setupConnection();

    // SQL query to increment the count for 'custnum'
    const updateCountQuery = `
    UPDATE counters 
    SET count = count + 1 
    WHERE name = 'custnum';
`;

    // Execute the update query
    await db.execute(updateCountQuery);

    // Fetch the new count
    const [rows] = await db.query('SELECT count FROM counters WHERE name = "custnum"');

    // Return the new customer ID
    return `CUST${rows[0].count}`;
}


