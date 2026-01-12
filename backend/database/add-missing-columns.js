/**
 * Add Missing Columns to Coaches Table
 * Connects to Azure MySQL and adds specialty and availability columns
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
  ssl: process.env.DB_HOST && process.env.DB_HOST.includes('azure') ? {
    rejectUnauthorized: false
  } : undefined
};

async function addMissingColumns() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...');
    console.log(`   Host: ${config.host}`);
    console.log(`   Database: ${config.database}`);
    
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL');
    
    // Check existing columns
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'coaches'
    `, [config.database]);
    
    const existingColumns = columns.map(col => col.COLUMN_NAME);
    console.log(`\n📋 Existing columns: ${existingColumns.join(', ')}`);
    
    const columnsToAdd = [];
    
    if (!existingColumns.includes('specialty')) {
      columnsToAdd.push({ name: 'specialty', type: 'VARCHAR(255)' });
    }
    
    if (!existingColumns.includes('availability')) {
      columnsToAdd.push({ name: 'availability', type: 'TEXT' });
    }
    
    if (columnsToAdd.length === 0) {
      console.log('\n✅ All required columns already exist!');
      process.exit(0);
    }
    
    // Add missing columns
    console.log(`\n🔧 Adding ${columnsToAdd.length} column(s)...`);
    for (const col of columnsToAdd) {
      try {
        await connection.query(`ALTER TABLE coaches ADD COLUMN ${col.name} ${col.type}`);
        console.log(`   ✅ Added column: ${col.name}`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`   ⏭️  Column ${col.name} already exists (skipping)`);
        } else {
          throw err;
        }
      }
    }
    
    // Verify
    const [updatedColumns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'coaches'
    `, [config.database]);
    
    console.log(`\n✅ Success! Coaches table now has ${updatedColumns.length} columns`);
    console.log(`   Columns: ${updatedColumns.map(c => c.COLUMN_NAME).join(', ')}`);
    
    await connection.end();
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

addMissingColumns();
