/**
 * Check if admin user exists
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'ajh_sports',
};

async function checkAdmin() {
  let connection;
  try {
    console.log('🔌 Connecting to MySQL...');
    connection = await mysql.createConnection(config);
    console.log('✅ Connected\n');

    const [users] = await connection.query(
      'SELECT id, email, name, role FROM users WHERE email = ?',
      ['admin@gmail.com']
    );

    if (users.length === 0) {
      console.log('❌ Admin user (admin@gmail.com) does NOT exist');
      console.log('\n💡 Run: npm run db:create-admin');
    } else {
      console.log('✅ Admin user found:');
      console.log(users[0]);
    }

    // Also check all users
    const [allUsers] = await connection.query(
      'SELECT id, email, name, role FROM users LIMIT 10'
    );
    console.log(`\n📊 Total users in database: ${allUsers.length}`);
    if (allUsers.length > 0) {
      console.log('Users:');
      allUsers.forEach(u => console.log(`  - ${u.email} (${u.role || 'user'})`));
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Database access denied. Check DB_PASS in .env');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Cannot connect to MySQL. Make sure MySQL is running.');
    }
  } finally {
    if (connection) await connection.end();
  }
}

checkAdmin();

