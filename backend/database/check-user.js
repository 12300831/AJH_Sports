import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'ajh_sports',
};

async function checkUser() {
  let connection;
  
  try {
    connection = await mysql.createConnection(config);
    
    // Check table structure
    const [columns] = await connection.query('DESCRIBE users');
    console.log('\n📋 Users table structure:');
    columns.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(nullable)' : '(not null)'} Default: ${col.Default || 'NULL'}`);
    });
    
    // Check admin user
    const [users] = await connection.query(
      'SELECT id, email, name, role, role IS NULL as role_is_null FROM users WHERE email = ?',
      ['admin@gmail.com']
    );
    
    console.log('\n👤 Admin user data:');
    if (users.length > 0) {
      console.log(JSON.stringify(users[0], null, 2));
      console.log(`\nRole value: "${users[0].role}"`);
      console.log(`Role type: ${typeof users[0].role}`);
      console.log(`Role is null: ${users[0].role_is_null}`);
      console.log(`Role === 'admin': ${users[0].role === 'admin'}`);
    } else {
      console.log('User not found!');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

checkUser();

