/**
 * Migration: Add image_url and hero_image_url columns to events table
 * Run from backend folder: node database/migrate-add-event-images.js
 * 
 * Uses the shared database connection from config/db.js
 */

import pool from '../config/db.js';

async function migrate() {
  let connection;
  
  try {
    // Get a connection from the shared pool
    connection = await pool.getConnection();
    console.log('🔌 Connected to database using shared config');

    // Get database name from the pool config
    const [dbResult] = await connection.query('SELECT DATABASE() as db_name');
    const dbName = dbResult[0].db_name;
    console.log(`📦 Using database: ${dbName}`);

    // Check if columns already exist
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'events' AND COLUMN_NAME IN ('image_url', 'hero_image_url')
    `, [dbName]);

    const existingColumns = columns.map(c => c.COLUMN_NAME);

    // Add image_url column if it doesn't exist
    if (!existingColumns.includes('image_url')) {
      await connection.query(`
        ALTER TABLE events ADD COLUMN image_url VARCHAR(1024) NULL AFTER location
      `);
      console.log('✅ Added image_url column to events table');
    } else {
      console.log('ℹ️  image_url column already exists');
    }

    // Add hero_image_url column if it doesn't exist
    if (!existingColumns.includes('hero_image_url')) {
      await connection.query(`
        ALTER TABLE events ADD COLUMN hero_image_url VARCHAR(1024) NULL AFTER image_url
      `);
      console.log('✅ Added hero_image_url column to events table');
    } else {
      console.log('ℹ️  hero_image_url column already exists');
    }

    console.log('🎉 Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      connection.release();
      console.log('🔌 Connection released back to pool');
    }
    // End the pool to allow the script to exit
    await pool.end();
    console.log('🔌 Pool closed');
  }
}

migrate();
