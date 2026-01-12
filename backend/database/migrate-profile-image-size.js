/**
 * Migration: Change profileImage column from VARCHAR(500) to TEXT
 * This allows storing base64 encoded images which can be 50KB+ in size
 * Run from backend folder: node database/migrate-profile-image-size.js
 */

import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || '';
const DB_NAME = process.env.DB_NAME || 'ajh_sports';

async function migrate() {
  let connection;
  
  try {
    console.log("🚀 Starting ProfileImage Column Migration...\n");
    
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
    });
    
    console.log("✅ Connected to database\n");

    // Check current column type
    const [columns] = await connection.query(`
      SELECT COLUMN_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
        AND TABLE_NAME = 'users' 
        AND COLUMN_NAME = 'profileImage'
    `, [DB_NAME]);

    if (columns.length === 0) {
      console.log("⚠️  profileImage column doesn't exist. Creating it as TEXT...");
      await connection.query(`
        ALTER TABLE users 
        ADD COLUMN profileImage TEXT AFTER lastActive
      `);
      console.log("✅ ProfileImage column created as TEXT\n");
    } else {
      const currentType = columns[0].COLUMN_TYPE;
      console.log(`📋 Current profileImage column type: ${currentType}\n`);
      
      if (currentType.includes('varchar') || currentType.includes('VARCHAR')) {
        console.log("🔄 Changing profileImage column from VARCHAR to TEXT...");
        await connection.query(`
          ALTER TABLE users 
          MODIFY COLUMN profileImage TEXT
        `);
        console.log("✅ ProfileImage column changed to TEXT\n");
      } else {
        console.log("✅ ProfileImage column is already TEXT or larger type\n");
      }
    }

    console.log("🎉 Migration completed successfully!");

  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log("🔌 Database connection closed\n");
    }
  }
}

migrate();
