/**
 * Contact Table Setup Script
 * Creates the contact_messages table
 * Usage: node database/setup-contact-simple.js
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ajh_sports',
  port: process.env.DB_PORT || 3306,
  multipleStatements: true
};

async function createContactTable() {
  let connection;
  try {
    console.log('🔌 Connecting to MySQL...');
    console.log(`   Host: ${config.host}`);
    console.log(`   User: ${config.user}`);
    console.log(`   Database: ${config.database}`);
    
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL server\n');

    // Read the SQL file
    const sqlPath = join(__dirname, 'schema-contact.sql');
    const sql = readFileSync(sqlPath, 'utf-8');

    // Execute the SQL
    console.log('📝 Creating contact_messages table...');
    await connection.query(sql);
    console.log('✅ contact_messages table created successfully!\n');

    // Verify the table was created
    const [tables] = await connection.query("SHOW TABLES LIKE 'contact_messages'");
    if (tables.length > 0) {
      console.log('✅ Table verification: contact_messages exists');
      
      // Show table structure
      const [columns] = await connection.query("DESCRIBE contact_messages");
      console.log('\n📋 Table structure:');
      console.table(columns.map(col => ({
        Field: col.Field,
        Type: col.Type,
        Null: col.Null,
        Key: col.Key,
        Default: col.Default
      })));
    }

    console.log('\n🎉 Contact table setup complete!');

  } catch (error) {
    if (error.code === 'ER_TABLE_EXISTS_ERROR') {
      console.log('ℹ️  Table contact_messages already exists');
      console.log('✅ Setup complete - table is ready to use!');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n❌ Database access denied.');
      console.error('\n💡 Please check your .env file in the backend folder:');
      console.error('   Make sure you have these variables set:');
      console.error('   DB_HOST=localhost');
      console.error('   DB_USER=root');
      console.error(`   DB_PASS=your_mysql_password`);
      console.error('   DB_NAME=ajh_sports');
      console.error('\n   Or run the SQL manually:');
      console.error('   mysql -u root -p ajh_sports < backend/database/schema-contact.sql');
      process.exit(1);
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n❌ Cannot connect to MySQL.');
      console.error('💡 Please make sure MySQL is running:');
      console.error('   On Mac: brew services start mysql (or check Services)');
      console.error('   On Windows: Check Services or run: net start MySQL80');
      process.exit(1);
    } else {
      console.error('\n❌ Error:', error.message);
      process.exit(1);
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createContactTable();


