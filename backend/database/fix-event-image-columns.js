/**
 * Fix Event Image Columns - Change VARCHAR to TEXT for base64 images
 * This script can be run via the backend API
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
  host: process.env.DB_HOST || 'ajh-sports-mysql.mysql.database.azure.com',
  user: process.env.DB_USER || 'ajhsportsadmin@ajh-sports-mysql',
  password: process.env.DB_PASS || 'Team404ajhsports',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'ajh_sports',
  ssl: {
    rejectUnauthorized: false
  }
};

async function fixEventImageColumns() {
  let connection;
  
  try {
    console.log('🔌 Connecting to Azure MySQL...');
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL\n');
    
    // Check current column types
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'events'
      AND COLUMN_NAME IN ('image_url', 'hero_image_url')
    `, [config.database]);
    
    console.log('📋 Current columns:', columns);
    
    // Fix image_url
    const imageUrlCol = columns.find(c => c.COLUMN_NAME === 'image_url');
    if (!imageUrlCol) {
      console.log('➕ Adding image_url column as TEXT...');
      await connection.query('ALTER TABLE events ADD COLUMN image_url TEXT NULL AFTER location');
      console.log('✅ Added image_url column');
    } else if (imageUrlCol.DATA_TYPE === 'varchar') {
      console.log('🔧 Converting image_url from VARCHAR to TEXT...');
      await connection.query('ALTER TABLE events MODIFY COLUMN image_url TEXT NULL');
      console.log('✅ Fixed image_url column');
    } else {
      console.log('✅ image_url is already TEXT');
    }
    
    // Fix hero_image_url
    const heroImageUrlCol = columns.find(c => c.COLUMN_NAME === 'hero_image_url');
    if (!heroImageUrlCol) {
      console.log('➕ Adding hero_image_url column as TEXT...');
      await connection.query('ALTER TABLE events ADD COLUMN hero_image_url TEXT NULL AFTER image_url');
      console.log('✅ Added hero_image_url column');
    } else if (heroImageUrlCol.DATA_TYPE === 'varchar') {
      console.log('🔧 Converting hero_image_url from VARCHAR to TEXT...');
      await connection.query('ALTER TABLE events MODIFY COLUMN hero_image_url TEXT NULL');
      console.log('✅ Fixed hero_image_url column');
    } else {
      console.log('✅ hero_image_url is already TEXT');
    }
    
    await connection.end();
    console.log('\n🎉 All event image columns fixed!');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('   Code:', error.code);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

fixEventImageColumns();
