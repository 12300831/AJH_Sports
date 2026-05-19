/**
 * Migration: Change status column to sports column
 * Replaces user status (Active/Inactive/etc) with sports preference (Tennis/Table Tennis)
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ajh_sports',
  multipleStatements: true,
};

async function migrate() {
  let connection;
  
  try {
    console.log('🔄 Starting migration: status → sports\n');
    console.log('Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database\n');

    // Step 1: Add sports column
    console.log('📋 Step 1: Adding sports column...');
    try {
      await connection.query(`
        ALTER TABLE users 
        ADD COLUMN sports VARCHAR(50) DEFAULT 'Tennis' AFTER role
      `);
      console.log('✅ Sports column added\n');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ Sports column already exists\n');
      } else {
        throw error;
      }
    }

    // Step 2: Set default sports for existing users
    console.log('📋 Step 2: Setting default sports for existing users...');
    await connection.query(`
      UPDATE users 
      SET sports = 'Tennis' 
      WHERE sports IS NULL OR sports = ''
    `);
    console.log('✅ Default sports set\n');

    // Step 3: Keep status column for now (for backward compatibility)
    // We'll remove it later if needed, but keeping it allows gradual migration
    console.log('📋 Step 3: Migration complete!\n');
    console.log('✅ Users table now has sports column');
    console.log('✅ Status column kept for backward compatibility\n');

    console.log('🎉 Migration completed successfully!\n');
    
  } catch (error) {
    console.error('❌ Migration error:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// Run migration
migrate()
  .then(() => {
    console.log('✅ Migration script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });
