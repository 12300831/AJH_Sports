import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get the path to .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, "..", ".env");

// Explicitly load .env from the correct path
dotenv.config({ path: envPath });

// Database connection configuration
// Uses TCP connection (more reliable across platforms)
// Socket path can be added if needed via environment variable
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "ajh_sports",
  port: process.env.DB_PORT || 3306,
  // socketPath can be set via DB_SOCKET_PATH if needed
  ...(process.env.DB_SOCKET_PATH && { socketPath: process.env.DB_SOCKET_PATH }),
});

export default pool;
