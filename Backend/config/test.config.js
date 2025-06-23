// database.config.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create a pool (auto handles connections) — no async needed
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '9798006085@p',
    database: 'farmTotable',
});

export default pool;