import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";

// Get the path to .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, "..", ".env");

// Explicitly load .env from the correct path
dotenv.config({ path: envPath });

// Database connection configuration
// Dynamically uses socket path on macOS or TCP connection on other platforms
const socketPath = process.env.DB_SOCKET_PATH || "/tmp/mysql.sock";
const useSocket = existsSync(socketPath);

// Determine if we should use SSL (required for Azure MySQL and most cloud providers)
const isLocalhost = !process.env.DB_HOST || 
                   process.env.DB_HOST === 'localhost' || 
                   process.env.DB_HOST === '127.0.0.1' ||
                   process.env.DB_HOST.startsWith('192.168.') ||
                   process.env.DB_HOST.startsWith('10.0.');
const useSSL = !isLocalhost && process.env.DB_HOST !== 'localhost';

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "ajh_sports",
  ...(useSocket ? { socketPath } : { port: process.env.DB_PORT || 3306 }),
  // Enable SSL for cloud databases (Azure MySQL, Railway, etc.)
  // Azure MySQL Flexible Server requires SSL connections
  ssl: useSSL ? {
    rejectUnauthorized: false // Cloud providers use self-signed certificates
  } : undefined,
  // Connection pool settings for better performance
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export default pool;
