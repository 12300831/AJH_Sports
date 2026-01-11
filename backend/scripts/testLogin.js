/**
 * Test Login Functionality
 * Tests email normalization and database query
 */

import pool from '../config/db.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

async function testLogin() {
  console.log('🔍 Testing Login Email Matching...\n');
  
  const testEmails = [
    'admin@gmail.com',
    'Admin@gmail.com',
    'ADMIN@GMAIL.COM',
    ' admin@gmail.com ',
    'Admin@Gmail.com',
    '12301167@students.koi.edu.au',
    '12301167@STUDENTS.KOI.EDU.AU',
    'nonexistent@example.com',
  ];

  for (const testEmail of testEmails) {
    const normalizedEmail = testEmail.trim().toLowerCase();
    
    try {
      const [rows] = await pool.query(
        `SELECT id, email, name FROM users WHERE LOWER(TRIM(email)) = ?`,
        [normalizedEmail]
      );

      if (rows.length > 0) {
        console.log(`✅ "${testEmail}" → Found: ${rows[0].email} (${rows[0].name})`);
      } else {
        console.log(`❌ "${testEmail}" → Not found`);
      }
    } catch (error) {
      console.error(`❌ Error testing "${testEmail}":`, error.message);
    }
  }

  console.log('\n📋 All users in database:');
  try {
    const [allUsers] = await pool.query('SELECT id, email, name FROM users');
    allUsers.forEach(user => {
      console.log(`  - ${user.email} (${user.name})`);
    });
  } catch (error) {
    console.error('Error fetching users:', error.message);
  }

  await pool.end();
}

testLogin().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});

