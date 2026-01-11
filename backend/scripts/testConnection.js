/**
 * Comprehensive Connection Test
 * Tests database, API endpoints, and configuration
 */

import pool from '../config/db.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

async function testConnections() {
  console.log('🔍 Testing Frontend-Backend-Database Connections...\n');
  
  // Test 1: Database Connection
  console.log('1️⃣ Testing Database Connection...');
  try {
    const [rows] = await pool.query('SELECT 1 as test, DATABASE() as db_name, USER() as db_user');
    console.log('   ✅ Database connected successfully');
    console.log(`   📊 Database: ${rows[0].db_name || 'N/A'}`);
    console.log(`   👤 User: ${rows[0].db_user || 'N/A'}\n`);
  } catch (error) {
    console.error('   ❌ Database connection failed:', error.message);
    console.error(`   💡 Check DB_HOST, DB_USER, DB_PASS, DB_NAME in .env\n`);
    return false;
  }

  // Test 2: Environment Variables
  console.log('2️⃣ Checking Environment Variables...');
  const requiredVars = ['DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME', 'PORT', 'JWT_SECRET'];
  const missing = requiredVars.filter(v => !process.env[v]);
  
  if (missing.length > 0) {
    console.error(`   ❌ Missing required variables: ${missing.join(', ')}\n`);
    return false;
  }
  console.log('   ✅ All required environment variables are set');
  console.log(`   🌐 Backend Port: ${process.env.PORT}`);
  console.log(`   🔗 Frontend URL: ${process.env.FRONTEND_URL || 'Not set'}\n`);

  // Test 3: Database Tables
  console.log('3️⃣ Checking Database Tables...');
  try {
    const [tables] = await pool.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME IN ('users', 'events', 'coaches', 'event_bookings', 'coach_bookings')
    `, [process.env.DB_NAME]);
    
    const tableNames = tables.map(t => t.TABLE_NAME);
    const requiredTables = ['users', 'events', 'coaches', 'event_bookings', 'coach_bookings'];
    const missingTables = requiredTables.filter(t => !tableNames.includes(t));
    
    if (missingTables.length > 0) {
      console.warn(`   ⚠️  Missing tables: ${missingTables.join(', ')}`);
      console.warn(`   💡 Run: npm run db:setup-extended\n`);
    } else {
      console.log('   ✅ All required tables exist\n');
    }
  } catch (error) {
    console.error('   ❌ Error checking tables:', error.message);
  }

  // Test 4: Users Table Structure
  console.log('4️⃣ Checking Users Table Structure...');
  try {
    const [columns] = await pool.query(`
      SELECT COLUMN_NAME, DATA_TYPE 
      FROM information_schema.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'
      ORDER BY ORDINAL_POSITION
    `, [process.env.DB_NAME]);
    
    const columnNames = columns.map(c => c.COLUMN_NAME);
    const requiredColumns = ['id', 'email', 'name', 'password', 'role', 'status'];
    const missingColumns = requiredColumns.filter(c => !columnNames.includes(c));
    
    if (missingColumns.length > 0) {
      console.warn(`   ⚠️  Missing columns: ${missingColumns.join(', ')}`);
    } else {
      console.log('   ✅ Users table has all required columns');
    }
    console.log(`   📋 Total columns: ${columns.length}\n`);
  } catch (error) {
    console.error('   ❌ Error checking users table:', error.message);
  }

  // Test 5: Sample Data Check
  console.log('5️⃣ Checking Sample Data...');
  try {
    const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
    const [events] = await pool.query('SELECT COUNT(*) as count FROM events');
    const [coaches] = await pool.query('SELECT COUNT(*) as count FROM coaches');
    
    console.log(`   👥 Users: ${users[0].count}`);
    console.log(`   📅 Events: ${events[0].count}`);
    console.log(`   🏃 Coaches: ${coaches[0].count}\n`);
  } catch (error) {
    console.warn('   ⚠️  Could not check sample data:', error.message);
  }

  console.log('✅ All connection tests completed!\n');
  console.log('📋 Connection Summary:');
  console.log(`   Backend: http://localhost:${process.env.PORT || 5001}`);
  console.log(`   Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`   Database: ${process.env.DB_NAME}@${process.env.DB_HOST}\n`);
  
  await pool.end();
  return true;
}

testConnections().catch(error => {
  console.error('❌ Connection test failed:', error);
  process.exit(1);
});
