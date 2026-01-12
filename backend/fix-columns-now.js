/**
 * Quick script to fix event image columns
 * This can be run directly via Azure App Service Console
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

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

async function fixColumns() {
  let connection;
  try {
    console.log('🔌 Connecting to MySQL...');
    connection = await mysql.createConnection(config);
    console.log('✅ Connected!\n');
    
    console.log('🔧 Fixing image_url column...');
    await connection.query(`ALTER TABLE events MODIFY COLUMN image_url TEXT NULL`);
    console.log('✅ image_url fixed to TEXT');
    
    console.log('🔧 Fixing hero_image_url column...');
    await connection.query(`ALTER TABLE events MODIFY COLUMN hero_image_url TEXT NULL`);
    console.log('✅ hero_image_url fixed to TEXT');
    
    console.log('\n🎉 All columns fixed successfully!');
    
    // Verify
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME, DATA_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'events'
      AND COLUMN_NAME IN ('image_url', 'hero_image_url')
    `, [config.database]);
    
    console.log('\n📋 Column Status:');
    columns.forEach(col => {
      console.log(`   ${col.COLUMN_NAME}: ${col.DATA_TYPE}`);
    });
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('   Code:', error.code);
    if (connection) await connection.end();
    process.exit(1);
  }
}

fixColumns();
