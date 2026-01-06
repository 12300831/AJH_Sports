/**
 * Test Database Connection
 * Tests if the database connection works with current .env settings
 */

import pool from '../config/db.js';

async function testConnection() {
  console.log('🧪 Testing Database Connection\n');
  console.log('='.repeat(50));
  
  try {
    console.log('📡 Attempting to connect to database...\n');
    
    const connection = await pool.getConnection();
    console.log('✅ Successfully connected to database!');
    
    // Test a simple query
    const [rows] = await connection.query('SELECT DATABASE() as current_db, USER() as current_user');
    console.log('\n📊 Connection Info:');
    console.log(`   Current Database: ${rows[0].current_db}`);
    console.log(`   Current User: ${rows[0].current_user}`);
    
    // Test if users table exists
    try {
      const [tables] = await connection.query("SHOW TABLES LIKE 'users'");
      if (tables.length > 0) {
        console.log('\n✅ Users table exists');
        
        // Check for admin user
        const [users] = await connection.query(
          "SELECT id, name, email, role FROM users WHERE email = ?",
          ['admin@gmail.com']
        );
        
        if (users.length > 0) {
          console.log('\n✅ Admin user found:');
          console.log(`   ID: ${users[0].id}`);
          console.log(`   Name: ${users[0].name}`);
          console.log(`   Email: ${users[0].email}`);
          console.log(`   Role: ${users[0].role || 'NOT SET'}`);
        } else {
          console.log('\n⚠️  Admin user (admin@gmail.com) not found');
          console.log('   Run: npm run db:fix-admin-login');
        }
      } else {
        console.log('\n⚠️  Users table does not exist');
        console.log('   Run: npm run db:setup');
      }
    } catch (err) {
      console.log('\n⚠️  Could not check tables:', err.message);
    }
    
    connection.release();
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ Database connection test PASSED!\n');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Database connection FAILED!');
    console.error(`   Error: ${error.message}`);
    console.error(`   Code: ${error.code}`);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 This means your database credentials are incorrect.');
      console.error('   Check your .env file:');
      console.error('   - DB_USER should be "root" (or your MySQL username)');
      console.error('   - DB_PASS should match your MySQL password');
      console.error('   - If MySQL has no password, leave DB_PASS empty');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Cannot connect to MySQL server.');
      console.error('   Make sure MySQL is running:');
      console.error('   - On macOS: brew services start mysql');
      console.error('   - Or: mysql.server start');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n💡 Database does not exist.');
      console.error('   Run: npm run db:setup');
    }
    
    console.log('');
    process.exit(1);
  }
}

testConnection();





