const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

let connection;

async function setupConnection() {
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '9798006085@p',
            database: 'farmTotable',
        });

        console.log('The MySQL database is connected');
        return connection;
    } catch (err) {
        console.error('An error occurred while connecting to MySQL:', err);
        throw err; // Ensure errors are propagated
    }
}



module.exports = { setupConnection, connection };
