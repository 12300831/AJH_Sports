/**
 * Set MySQL Root Password Script
 * This script sets the MySQL root password to match the .env file
 * 
 * IMPORTANT: Run this script after setting DB_PASS in your .env file
 * You may need to connect with your current password first, or if no password is set, connect without a password
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const NEW_PASSWORD = process.env.DB_PASS || 'ajhsports2024';
const OLD_PASSWORD = process.env.DB_PASS_OLD || '';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setMySQLPassword() {
  let connection;
  
  try {
    console.log('🔐 MySQL Root Password Setup');
    console.log('============================\n');
    
    // Try to connect - first try with old password, then without password
    console.log('🔌 Attempting to connect to MySQL...');
    
    let connected = false;
    
    // Try with old password if provided
    if (OLD_PASSWORD) {
      try {
        connection = await mysql.createConnection({
          host: process.env.DB_HOST || 'localhost',
          user: 'root',
          password: OLD_PASSWORD,
          port: process.env.DB_PORT || 3306
        });
        console.log('✅ Connected with old password\n');
        connected = true;
      } catch (error) {
        console.log('❌ Failed to connect with old password, trying without password...\n');
      }
    }
    
    // Try without password if not connected
    if (!connected) {
      try {
        connection = await mysql.createConnection({
          host: process.env.DB_HOST || 'localhost',
          user: 'root',
          password: '',
          port: process.env.DB_PORT || 3306
        });
        console.log('✅ Connected without password (no password was set)\n');
        connected = true;
      } catch (error) {
        console.error('❌ Could not connect to MySQL');
        console.error('Error:', error.message);
        console.error('\n💡 You may need to:');
        console.error('   1. Make sure MySQL is running');
        console.error('   2. Know your current root password');
        console.error('   3. Connect manually and set the password');
        process.exit(1);
      }
    }
    
    // Set the new password
    console.log(`🔑 Setting MySQL root password to: ${NEW_PASSWORD}`);
    console.log('⚠️  This will change the root password for all root users (localhost and %)\n');
    
    try {
      // Set password for root@localhost
      await connection.query(`ALTER USER 'root'@'localhost' IDENTIFIED BY ?`, [NEW_PASSWORD]);
      console.log('✅ Password set for root@localhost');
      
      // Try to set password for root@% (may not exist)
      try {
        await connection.query(`ALTER USER 'root'@'%' IDENTIFIED BY ?`, [NEW_PASSWORD]);
        console.log('✅ Password set for root@%');
      } catch (error) {
        // root@% might not exist, that's okay
        if (!error.message.includes("doesn't exist")) {
          throw error;
        }
      }
      
      // Flush privileges
      await connection.query('FLUSH PRIVILEGES');
      console.log('✅ Privileges flushed\n');
      
      console.log('🎉 MySQL root password successfully set!');
      console.log(`\n📋 Password: ${NEW_PASSWORD}`);
      console.log('\n💡 Make sure your backend/.env file has:');
      console.log(`   DB_PASS=${NEW_PASSWORD}`);
      
    } catch (error) {
      console.error('❌ Error setting password:');
      console.error(error.message);
      throw error;
    }
    
  } catch (error) {
    console.error('\n❌ Failed to set MySQL password');
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
    rl.close();
  }
}

setMySQLPassword();

