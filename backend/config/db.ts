import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// Support both DB_PASS and DB_PASSWORD for compatibility
const dbPassword = process.env.DB_PASS || process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME || process.env.DB_DATABASE || 'ajhsports_db';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: dbPassword || '',
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export default pool;

