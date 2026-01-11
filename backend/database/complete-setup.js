/**
 * Complete MySQL Setup Script
 * Sets password, creates database, runs schema, adds role column, creates admin
 */

import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env
dotenv.config({ path: join(__dirname, '../.env') });

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || 'ajhsports2024';
const DB_NAME = process.env.DB_NAME || 'ajh_sports';

async function completeSetup() {
  console.log("🚀 Starting Complete MySQL Setup...\n");

  let connection;
  
  try {
    // Step 1: Try to connect - first without password, then with password
    console.log("Step 1: Connecting to MySQL server...");
    
    // Try connecting without password first
    try {
      connection = await mysql.createConnection({
        host: DB_HOST,
        user: DB_USER,
        // No password
      });
      console.log("✅ Connected to MySQL (no password)\n");
      
      // Set password
      console.log("   Setting MySQL root password to 'ajhsports2024'...");
      await connection.query(`ALTER USER 'root'@'localhost' IDENTIFIED BY 'ajhsports2024'`);
      await connection.query('FLUSH PRIVILEGES');
      console.log("✅ Password set successfully\n");
      
      // Close and reconnect with password
      await connection.end();
      connection = await mysql.createConnection({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASS,
      });
      console.log("✅ Reconnected with new password\n");
      
    } catch (noPassError) {
      // If that fails, try with password
      try {
        connection = await mysql.createConnection({
          host: DB_HOST,
          user: DB_USER,
          password: DB_PASS,
        });
        console.log("✅ Connected to MySQL (with password)\n");
      } catch (passError) {
        throw new Error(`Cannot connect to MySQL. Tried without password and with password 'ajhsports2024'. Error: ${passError.message}`);
      }
    }

    // Step 2: Create database
    console.log(`Step 2: Creating database '${DB_NAME}'...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    console.log(`✅ Database '${DB_NAME}' created or already exists\n`);

    // Step 3: Use the database
    await connection.query(`USE \`${DB_NAME}\``);

    // Step 4: Create users table if it doesn't exist
    console.log("Step 3: Creating users table...");
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
    console.log("✅ Users table created or already exists\n");

    // Step 5: Add role column if it doesn't exist
    console.log("Step 4: Adding role column...");
    try {
      await connection.query(`
        ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user'
      `);
      console.log("✅ Role column added\n");
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log("✅ Role column already exists\n");
      } else {
        throw error;
      }
    }

    // Step 6: Try to run schema.sql if it exists
    console.log("Step 5: Checking for schema.sql...");
    try {
      const schemaPath = join(__dirname, 'schema.sql');
      const schemaSQL = readFileSync(schemaPath, 'utf8');
      // Split by semicolons and execute each statement
      const statements = schemaSQL.split(';').filter(s => s.trim().length > 0);
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await connection.query(statement);
          } catch (err) {
            // Ignore errors for statements that may already exist
            if (!err.message.includes('already exists') && err.code !== 'ER_DUP_FIELDNAME') {
              console.log(`⚠️  Schema statement warning: ${err.message}`);
            }
          }
        }
      }
      console.log("✅ Schema.sql applied\n");
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log("ℹ️  schema.sql not found, skipping\n");
      } else {
        console.log(`⚠️  Schema.sql warning: ${error.message}\n`);
      }
    }

    // Step 7: Create admin user
    console.log("Step 6: Creating admin user...");
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.default.hash('admin', 10);
    
    try {
      // Check if admin already exists
      const [existing] = await connection.query(
        "SELECT id FROM users WHERE email = ?",
        ['admin@gmail.com']
      );

      if (existing.length > 0) {
        // Update existing admin
        await connection.query(
          "UPDATE users SET name = ?, password = ?, role = ? WHERE email = ?",
          ['Admin User', hashedPassword, 'admin', 'admin@gmail.com']
        );
        console.log("✅ Admin user updated\n");
      } else {
        // Create new admin
        await connection.query(
          "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
          ['Admin User', 'admin@gmail.com', hashedPassword, 'admin']
        );
        console.log("✅ Admin user created\n");
      }
    } catch (error) {
      console.log(`⚠️  Admin creation: ${error.message}\n`);
    }

    // Verification
    console.log("📊 Verification:");
    console.log("================\n");
    
    const [databases] = await connection.query("SHOW DATABASES LIKE ?", [DB_NAME]);
    console.log(`✅ Database '${DB_NAME}': ${databases.length > 0 ? 'EXISTS' : 'NOT FOUND'}`);
    
    const [tables] = await connection.query("SHOW TABLES LIKE 'users'");
    console.log(`✅ Users table: ${tables.length > 0 ? 'EXISTS' : 'NOT FOUND'}`);
    
    const [columns] = await connection.query("SHOW COLUMNS FROM users LIKE 'role'");
    console.log(`✅ Role column: ${columns.length > 0 ? 'EXISTS' : 'NOT FOUND'}`);
    
    const [admin] = await connection.query(
      "SELECT id, name, email, role FROM users WHERE email = ?",
      ['admin@gmail.com']
    );
    console.log(`✅ Admin user: ${admin.length > 0 ? 'EXISTS' : 'NOT FOUND'}`);
    if (admin.length > 0) {
      console.log(`   Email: ${admin[0].email}`);
      console.log(`   Role: ${admin[0].role}`);
    }

    console.log("\n🎉 Complete MySQL Setup Finished Successfully!");
    console.log("\n🔑 Admin Credentials:");
    console.log("   Email:    admin@gmail.com");
    console.log("   Password: admin");

  } catch (error) {
    console.error("\n❌ Setup Error:", error.message);
    console.error("   Error Code:", error.code);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error("\n💡 Access Denied - MySQL password needs to be set manually:");
      console.error("   Run: sudo mysql");
      console.error("   Then: ALTER USER 'root'@'localhost' IDENTIFIED BY 'ajhsports2024';");
      console.error("   Then: FLUSH PRIVILEGES;");
      console.error("   Then: EXIT;");
      console.error("   Then run this script again: node database/complete-setup.js");
    } else if (error.code === 'ECONNREFUSED') {
      console.error("\n💡 Connection Refused - MySQL may not be running:");
      console.error("   macOS: brew services start mysql");
      console.error("   Linux: sudo systemctl start mysql");
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

completeSetup();
