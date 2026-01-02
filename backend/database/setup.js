/**
 * Database Setup Script
 * Run this to create the database and tables
 * Usage: node database/setup.js
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  port: process.env.DB_PORT || 3306,
  multipleStatements: true
};

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🔌 Connecting to MySQL...');
    console.log(`   Host: ${config.host}`);
    console.log(`   User: ${config.user}`);
    console.log(`   Port: ${config.port}`);
    
    // Connect without specifying database first
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL server\n');

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'ajh_sports';
    console.log(`📦 Creating database '${dbName}' if it doesn't exist...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`✅ Database '${dbName}' ready\n`);

    // Switch to the database
    await connection.query(`USE \`${dbName}\``);

    // Create users table
    console.log('📋 Creating users table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        location VARCHAR(255),
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created\n');

    console.log('🎉 Database setup complete!');
    console.log(`\n📊 Database: ${dbName}`);
    console.log('📝 Tables created:');
    console.log('   - users');

  } catch (error) {
    console.error('❌ Error setting up database:');
    console.error(error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 MySQL server is not running or not accessible.');
      console.error('   Please make sure MySQL is installed and running.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Access denied. Please check your username and password in .env file.');
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connection closed');
    }
  }
}

setupDatabase();

