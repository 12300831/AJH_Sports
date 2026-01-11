/**
 * Migration: Add 'inactive' status to events table
 * This adds soft-delete capability to the events table
 * 
 * Run: node backend/database/migrate-add-inactive-status.js
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'ajh_sports',
};

async function migrate() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL');

    // Check if events table exists
    const [tables] = await connection.query(
      "SHOW TABLES LIKE 'events'"
    );
    
    if (tables.length === 0) {
      console.log('❌ Events table does not exist. Please run setup-extended.js first.');
      process.exit(1);
    }

    // Check current ENUM values
    const [columns] = await connection.query(
      "SHOW COLUMNS FROM events LIKE 'status'"
    );
    
    if (columns.length === 0) {
      console.log('❌ Status column not found in events table.');
      process.exit(1);
    }

    const currentType = columns[0].Type;
    console.log(`📋 Current status column type: ${currentType}`);

    // Check if 'inactive' already exists in the ENUM
    if (currentType.includes('inactive')) {
      console.log('✅ Status column already includes "inactive". No migration needed.');
      process.exit(0);
    }

    // Alter the ENUM to include 'inactive'
    console.log('🔧 Adding "inactive" to status ENUM...');
    await connection.query(`
      ALTER TABLE events 
      MODIFY COLUMN status ENUM('active', 'inactive', 'cancelled', 'completed') 
      DEFAULT 'active'
    `);

    console.log('✅ Migration complete! Status column now includes "inactive".');
    
    // Verify the change
    const [updatedColumns] = await connection.query(
      "SHOW COLUMNS FROM events LIKE 'status'"
    );
    console.log(`📋 Updated status column type: ${updatedColumns[0].Type}`);

  } catch (error) {
    console.error('❌ Migration error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

migrate();
