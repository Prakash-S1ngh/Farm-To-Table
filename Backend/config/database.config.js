



const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function setupConnection() {
    try {
        const connection = mysql.createConnection({
            host: 'localhost',
            user: "root",
            password: '9798006085@p',
            database: "farmTotable"
        });

        console.log('The MySQL database is connected');
        return connection;
    } catch (err) {
        console.log('An error occurred while connecting to MySQL:', err);
    }
}

module.exports = setupConnection;
