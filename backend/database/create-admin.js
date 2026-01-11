/**
 * Create Admin User Script
 * Creates or updates a user to have admin privileges
 */

import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'ajh_sports',
  // Only use socket on macOS/Linux if socket path is provided via env
  ...(process.env.DB_SOCKET_PATH && { socketPath: process.env.DB_SOCKET_PATH }),
  multipleStatements: true
};

async function createAdminUser() {
  let connection;
  
  try {
    console.log('🔌 Connecting to MySQL...');
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL\n');

    const email = 'admin@gmail.com';
    const password = 'admin';
    const name = 'Admin User';

    // Check if user already exists
    console.log(`📧 Checking if user ${email} exists...`);
    const [existingUsers] = await connection.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      // User exists, update to admin
      console.log('👤 User found. Updating to admin...');
      const hashedPassword = await bcrypt.hash(password, 10);
      
      await connection.query(
        'UPDATE users SET password = ?, role = ?, name = ? WHERE email = ?',
        [hashedPassword, 'admin', name, email]
      );
      
      console.log('✅ User updated to admin successfully!');
      console.log(`\n📋 Admin Credentials:`);
      console.log(`   Email: ${email}`);
      console.log(`   Password: ${password}`);
      console.log(`   Role: admin`);
    } else {
      // User doesn't exist, create new admin user
      console.log('👤 User not found. Creating new admin user...');
      const hashedPassword = await bcrypt.hash(password, 10);
      
      await connection.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, 'admin']
      );
      
      console.log('✅ Admin user created successfully!');
      console.log(`\n📋 Admin Credentials:`);
      console.log(`   Email: ${email}`);
      console.log(`   Password: ${password}`);
      console.log(`   Role: admin`);
    }

    console.log('\n🎉 Admin setup complete!');
    console.log('\n💡 You can now log in to the admin portal at:');
    console.log('   http://localhost:3000/admin');

  } catch (error) {
    console.error('❌ Error creating admin user:');
    console.error(error.message);
    
    if (error.code === 'ER_NO_SUCH_TABLE') {
      console.error('\n💡 The users table might not exist. Run: npm run db:setup');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n💡 The database might not exist. Run: npm run db:setup');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Cannot connect to MySQL. Make sure MySQL is running.');
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connection closed');
    }
  }
}

createAdminUser();

