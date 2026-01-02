/**
 * Extended Database Setup Script
 * Run this to create events, coaches, and bookings tables
 * Usage: node database/setup-extended.js
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  port: process.env.DB_PORT || 3306,
  multipleStatements: true
};

async function setupExtendedDatabase() {
  let connection;
  
  try {
    console.log('🔌 Connecting to MySQL...');
    console.log(`   Host: ${config.host}`);
    console.log(`   User: ${config.user}`);
    console.log(`   Port: ${config.port}`);
    
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL server\n');

    const dbName = process.env.DB_NAME || 'ajh_sports';
    await connection.query(`USE \`${dbName}\``);
    console.log(`📦 Using database: ${dbName}\n`);

    // Read and execute extended schema
    const schemaPath = path.join(__dirname, 'schema-extended.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📋 Creating extended tables (events, coaches, bookings)...');
    await connection.query(schema);
    console.log('✅ Extended tables created\n');

    console.log('🎉 Extended database setup complete!');
    console.log(`\n📊 Database: ${dbName}`);
    console.log('📝 Tables created/updated:');
    console.log('   - users (role column added)');
    console.log('   - events');
    console.log('   - event_bookings');
    console.log('   - coaches');
    console.log('   - coach_bookings');

  } catch (error) {
    console.error('❌ Error setting up extended database:');
    console.error(error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 MySQL server is not running or not accessible.');
      console.error('   Please make sure MySQL is installed and running.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Access denied. Please check your username and password in .env file.');
    } else if (error.code === 'ER_DUP_FIELDNAME') {
      console.error('\n💡 Some columns already exist. This is okay - continuing...');
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connection closed');
    }
  }
}

setupExtendedDatabase();

