/**
 * Migration: Add User Management Fields
 * Adds all required fields for production-ready user management system
 */

import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || 'ajhsports2024';
const DB_NAME = process.env.DB_NAME || 'ajh_sports';

async function migrate() {
  let connection;
  
  try {
    console.log("🚀 Starting User Management Migration...\n");
    
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
    });
    
    console.log("✅ Connected to database\n");

    // 1. Add UUID column (we'll use VARCHAR for UUID strings)
    console.log("Step 1: Adding uuid column...");
    try {
      await connection.query(`
        ALTER TABLE users 
        ADD COLUMN uuid VARCHAR(36) UNIQUE AFTER id
      `);
      console.log("✅ UUID column added\n");
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log("✅ UUID column already exists\n");
      } else {
        throw error;
      }
    }

    // 2. Add fullName column (rename name to fullName or add as separate)
    console.log("Step 2: Adding fullName column...");
    try {
      await connection.query(`
        ALTER TABLE users 
        ADD COLUMN fullName VARCHAR(255) AFTER uuid
      `);
      // Copy existing name to fullName
      await connection.query(`
        UPDATE users SET fullName = name WHERE fullName IS NULL OR fullName = ''
      `);
      console.log("✅ fullName column added\n");
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log("✅ fullName column already exists\n");
      } else {
        throw error;
      }
    }

    // 3. Add username column (unique)
    console.log("Step 3: Adding username column...");
    try {
      await connection.query(`
        ALTER TABLE users 
        ADD COLUMN username VARCHAR(100) UNIQUE AFTER email
      `);
      // Generate usernames from email for existing users
      await connection.query(`
        UPDATE users 
        SET username = SUBSTRING_INDEX(email, '@', 1) 
        WHERE username IS NULL OR username = ''
      `);
      console.log("✅ Username column added\n");
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log("✅ Username column already exists\n");
      } else {
        throw error;
      }
    }

    // 4. Update role column to support more roles
    console.log("Step 4: Updating role column...");
    try {
      await connection.query(`
        ALTER TABLE users 
        MODIFY COLUMN role VARCHAR(50) DEFAULT 'User'
      `);
      // Update existing roles to match new format
      await connection.query(`
        UPDATE users 
        SET role = CASE 
          WHEN role = 'admin' THEN 'Admin'
          WHEN role = 'user' THEN 'User'
          WHEN role IS NULL OR role = '' THEN 'User'
          ELSE role
        END
      `);
      console.log("✅ Role column updated\n");
    } catch (error) {
      console.log(`⚠️  Role column update: ${error.message}\n`);
    }

    // 5. Add status column
    console.log("Step 5: Adding status column...");
    try {
      await connection.query(`
        ALTER TABLE users 
        ADD COLUMN status VARCHAR(50) DEFAULT 'Active' AFTER role
      `);
      // Set all existing users to Active
      await connection.query(`
        UPDATE users SET status = 'Active' WHERE status IS NULL OR status = ''
      `);
      console.log("✅ Status column added\n");
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log("✅ Status column already exists\n");
      } else {
        throw error;
      }
    }

    // 6. Add joinedDate column (use created_at as joinedDate)
    console.log("Step 6: Adding joinedDate column...");
    try {
      await connection.query(`
        ALTER TABLE users 
        ADD COLUMN joinedDate DATETIME DEFAULT CURRENT_TIMESTAMP AFTER status
      `);
      // Copy created_at to joinedDate
      await connection.query(`
        UPDATE users SET joinedDate = created_at WHERE joinedDate IS NULL
      `);
      console.log("✅ JoinedDate column added\n");
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log("✅ JoinedDate column already exists\n");
      } else {
        throw error;
      }
    }

    // 7. Add lastActive column
    console.log("Step 7: Adding lastActive column...");
    try {
      await connection.query(`
        ALTER TABLE users 
        ADD COLUMN lastActive DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER joinedDate
      `);
      // Initialize with current timestamp
      await connection.query(`
        UPDATE users SET lastActive = NOW() WHERE lastActive IS NULL
      `);
      console.log("✅ LastActive column added\n");
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log("✅ LastActive column already exists\n");
      } else {
        throw error;
      }
    }

    // 8. Add profileImage column
    console.log("Step 8: Adding profileImage column...");
    try {
      await connection.query(`
        ALTER TABLE users 
        ADD COLUMN profileImage VARCHAR(500) AFTER lastActive
      `);
      console.log("✅ ProfileImage column added\n");
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log("✅ ProfileImage column already exists\n");
      } else {
        throw error;
      }
    }

    // 9. Add indexes for performance
    console.log("Step 9: Adding indexes...");
    try {
      await connection.query(`
        CREATE INDEX idx_status ON users(status)
      `);
      console.log("✅ Status index added\n");
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log("✅ Status index already exists\n");
      } else {
        console.log(`⚠️  Index creation: ${error.message}\n`);
      }
    }

    try {
      await connection.query(`
        CREATE INDEX idx_role ON users(role)
      `);
      console.log("✅ Role index added\n");
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log("✅ Role index already exists\n");
      } else {
        console.log(`⚠️  Index creation: ${error.message}\n`);
      }
    }

    // 10. Generate UUIDs for existing users
    console.log("Step 10: Generating UUIDs for existing users...");
    const { v4: uuidv4 } = await import('uuid');
    const [users] = await connection.query("SELECT id FROM users WHERE uuid IS NULL OR uuid = ''");
    for (const user of users) {
      const uuid = uuidv4();
      await connection.query("UPDATE users SET uuid = ? WHERE id = ?", [uuid, user.id]);
    }
    console.log(`✅ Generated UUIDs for ${users.length} users\n`);

    console.log("🎉 Migration completed successfully!");
    console.log("\n📊 Summary:");
    console.log("  ✅ UUID column added");
    console.log("  ✅ fullName column added");
    console.log("  ✅ Username column added");
    console.log("  ✅ Role column updated");
    console.log("  ✅ Status column added");
    console.log("  ✅ JoinedDate column added");
    console.log("  ✅ LastActive column added");
    console.log("  ✅ ProfileImage column added");
    console.log("  ✅ Indexes created");

  } catch (error) {
    console.error("\n❌ Migration Error:", error.message);
    console.error("   Error Code:", error.code);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

migrate();

