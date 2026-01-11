import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function createDatabase() {
  const dbName = process.env.DB_NAME || 'ajhsports_db';
  const dbPassword = process.env.DB_PASS || process.env.DB_PASSWORD;
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbUser = process.env.DB_USER || 'root';
  
  if (!dbPassword) {
    console.error('❌ DB_PASS or DB_PASSWORD must be set in .env file');
    console.error('   Please update your .env file with the correct MySQL password');
    process.exit(1);
  }
  
  console.log(`Attempting to connect to MySQL as ${dbUser}@${dbHost}...`);
  
  // Connect without specifying database
  let connection;
  try {
    connection = await mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
    });
    console.log('✅ Connected to MySQL server');
  } catch (error) {
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('❌ Access denied. Please check:');
      console.error('   1. DB_USER in .env matches your MySQL username');
      console.error('   2. DB_PASS (or DB_PASSWORD) in .env matches your MySQL password');
      console.error('   3. MySQL server is running');
    } else {
      console.error('❌ Connection error:', error.message);
    }
    process.exit(1);
  }

  try {
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`✅ Database '${dbName}' created or already exists.`);

    // Use the database
    await connection.query(`USE \`${dbName}\``);

    // Create users table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        location VARCHAR(255),
        password VARCHAR(255),
        provider VARCHAR(50),
        provider_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log(`✅ Table 'users' created or already exists.`);

    // Check if OAuth columns exist, add them if not
    try {
      await connection.query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS provider VARCHAR(50),
        ADD COLUMN IF NOT EXISTS provider_id VARCHAR(255)
      `);
    } catch (error) {
      // Columns might already exist, check individually
      const [columns] = await connection.query(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME IN ('provider', 'provider_id')
      `, [dbName]);
      
      if (columns.length < 2) {
        if (!columns.find(c => c.COLUMN_NAME === 'provider')) {
          await connection.query(`ALTER TABLE users ADD COLUMN provider VARCHAR(50)`);
        }
        if (!columns.find(c => c.COLUMN_NAME === 'provider_id')) {
          await connection.query(`ALTER TABLE users ADD COLUMN provider_id VARCHAR(255)`);
        }
        console.log(`✅ OAuth columns added to 'users' table.`);
      }
    }

    // Make password nullable for OAuth users
    await connection.query(`
      ALTER TABLE users 
      MODIFY COLUMN password VARCHAR(255) NULL
    `).catch(() => {
      // Column might already be nullable
    });

    console.log(`✅ Database setup complete!`);
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

createDatabase()
  .then(() => {
    console.log('✅ Database initialization successful!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  });

