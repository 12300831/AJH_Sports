/**
 * Diagnostic and Fix Script for Admin Login Issues
 * This script checks and fixes common admin login problems
 */

import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env');

dotenv.config({ path: envPath });

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'ajh_sports',
  multipleStatements: true
};

async function fixAdminLogin() {
  let connection;
  
  console.log('🔍 Admin Login Diagnostic Tool\n');
  console.log('='.repeat(50));
  
  try {
    // Step 0: Check if .env file exists
    if (!existsSync(envPath)) {
      console.log('\n⚠️  .env file is missing!');
      console.log('💡 Creating .env file with default values...');
      
      const defaultEnv = `# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_PORT=3306
DB_NAME=ajh_sports

# Server Configuration
PORT=5001
NODE_ENV=development

# JWT Secret for authentication (will be auto-generated below)
JWT_SECRET=

# Frontend URL
FRONTEND_URL=http://localhost:5173
`;
      
      writeFileSync(envPath, defaultEnv);
      console.log('✅ Created .env file');
      console.log('\n⚠️  IMPORTANT: Update DB_PASS in .env if your MySQL requires a password!');
      console.log(`   Location: ${envPath}\n`);
      
      // Reload environment variables
      dotenv.config({ path: envPath });
    }
    
    // Step 1: Check JWT_SECRET
    console.log('\n1️⃣  Checking JWT_SECRET...');
    if (!process.env.JWT_SECRET) {
      console.log('❌ JWT_SECRET is NOT set in .env file');
      console.log('\n💡 Generating and adding JWT_SECRET...');
      
      // Generate a secure random secret
      const crypto = await import('crypto');
      const jwtSecret = crypto.randomBytes(32).toString('hex');
      
      // Read existing .env file
      let envContent = '';
      if (existsSync(envPath)) {
        envContent = readFileSync(envPath, 'utf8');
      }
      
      // Add or update JWT_SECRET
      if (envContent.includes('JWT_SECRET=')) {
        envContent = envContent.replace(/JWT_SECRET=.*/g, `JWT_SECRET=${jwtSecret}`);
        console.log('✅ Updated existing JWT_SECRET in .env');
      } else {
        envContent += `\n# JWT Secret for authentication\nJWT_SECRET=${jwtSecret}\n`;
        console.log('✅ Added JWT_SECRET to .env');
      }
      
      writeFileSync(envPath, envContent);
      console.log(`   JWT_SECRET=${jwtSecret.substring(0, 20)}...`);
      console.log('\n⚠️  IMPORTANT: Restart your backend server after this script completes!');
    } else {
      console.log('✅ JWT_SECRET is set');
      console.log(`   Value: ${process.env.JWT_SECRET.substring(0, 20)}...`);
    }

    // Step 2: Check database connection
    console.log('\n2️⃣  Checking database connection...');
    console.log(`   Host: ${config.host}`);
    console.log(`   User: ${config.user}`);
    console.log(`   Database: ${config.database}`);
    console.log(`   Port: ${config.port}`);
    
    try {
      connection = await mysql.createConnection(config);
      console.log('✅ Connected to MySQL database');
    } catch (dbError) {
      if (dbError.code === 'ER_ACCESS_DENIED_ERROR') {
        console.error('❌ Database access denied!');
        console.error(`   Error: ${dbError.message}`);
        console.error('\n💡 Common solutions:');
        console.error('   1. Check if DB_USER and DB_PASS in .env are correct');
        console.error('   2. On macOS, MySQL root user might need a password');
        console.error('   3. Try updating .env with correct credentials:');
        console.error('      DB_USER=root');
        console.error('      DB_PASS=your_mysql_password');
        console.error('\n   After updating .env, run this script again.');
        throw dbError;
      } else if (dbError.code === 'ECONNREFUSED') {
        console.error('❌ Cannot connect to MySQL server!');
        console.error('💡 Make sure MySQL is running:');
        console.error('   On macOS: brew services start mysql');
        console.error('   Or: mysql.server start');
        throw dbError;
      } else {
        throw dbError;
      }
    }

    // Step 3: Check if admin user exists
    console.log('\n3️⃣  Checking admin user...');
    const email = 'admin@gmail.com';
    const password = 'admin';
    const name = 'Admin User';

    const [existingUsers] = await connection.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      console.log('✅ Admin user exists');
      const adminUser = existingUsers[0];
      console.log(`   ID: ${adminUser.id}`);
      console.log(`   Name: ${adminUser.name || 'N/A'}`);
      console.log(`   Role: ${adminUser.role || 'NOT SET (will default to user)'}`);
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, adminUser.password);
      if (!isPasswordValid) {
        console.log('⚠️  Password does not match "admin" - updating...');
        const hashedPassword = await bcrypt.hash(password, 10);
        await connection.query(
          'UPDATE users SET password = ? WHERE email = ?',
          [hashedPassword, email]
        );
        console.log('✅ Password updated');
      } else {
        console.log('✅ Password is correct');
      }

      // Ensure role is set to admin
      if (adminUser.role !== 'admin') {
        console.log('⚠️  Role is not "admin" - updating...');
        await connection.query(
          'UPDATE users SET role = ?, name = ? WHERE email = ?',
          ['admin', name, email]
        );
        console.log('✅ Role updated to admin');
      } else {
        console.log('✅ Role is already set to admin');
      }
    } else {
      console.log('❌ Admin user does NOT exist - creating...');
      const hashedPassword = await bcrypt.hash(password, 10);
      
      await connection.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, 'admin']
      );
      
      console.log('✅ Admin user created successfully!');
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ All checks passed!\n');
    console.log('📋 Admin Login Credentials:');
    console.log('   Email: admin@gmail.com');
    console.log('   Password: admin');
    console.log('   Role: admin\n');
    
    console.log('⚠️  IMPORTANT NEXT STEPS:');
    console.log('   1. Restart your backend server:');
    console.log('      cd backend');
    console.log('      npm restart');
    console.log('   2. Try logging in with the credentials above');
    console.log('   3. If you still get errors, check the backend console for details\n');

  } catch (error) {
    console.error('\n❌ Error during diagnostic:');
    console.error(error.message);
    
    if (error.code === 'ER_NO_SUCH_TABLE') {
      console.error('\n💡 The users table might not exist. Run: npm run db:setup');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n💡 The database might not exist. Run: npm run db:setup');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Cannot connect to MySQL. Make sure MySQL is running.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Database access denied. Check your DB_USER and DB_PASS in .env');
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

fixAdminLogin();

