/**
 * Create Test Player Account
 * Creates a test player user for development/testing
 */

import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

async function createTestPlayer() {
  console.log('🔧 Creating test player account...\n');

  const playerData = {
    email: 'player@test.com',
    password: 'player123',
    name: 'Test Player',
    fullName: 'Test Player',
    username: 'testplayer',
    phone: null,
    location: 'Sydney, NSW',
    role: 'Player',
    status: 'Active',
  };

  try {
    // Check if player already exists
    const [existing] = await pool.query(
      "SELECT id, email FROM users WHERE LOWER(TRIM(email)) = ?",
      [playerData.email.toLowerCase()]
    );

    if (existing.length > 0) {
      console.log(`⚠️  Player account already exists: ${existing[0].email}`);
      console.log(`   ID: ${existing[0].id}`);
      console.log('\n💡 To reset the password, delete the user first or update manually.');
      await pool.end();
      return;
    }

    // Generate UUID
    const uuid = uuidv4();

    // Hash password
    const hashedPassword = await bcrypt.hash(playerData.password, 10);

    // Generate unique username if needed
    let finalUsername = playerData.username;
    let attempts = 0;
    while (attempts < 10) {
      const [usernameCheck] = await pool.query(
        "SELECT id FROM users WHERE username = ?",
        [finalUsername]
      );
      if (usernameCheck.length === 0) break;
      finalUsername = playerData.username + Math.floor(Math.random() * 1000);
      attempts++;
    }

    // Insert player
    const [result] = await pool.query(
      `INSERT INTO users (
        uuid, name, fullName, email, username, phone, location, password, 
        role, status, joinedDate, lastActive
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        uuid,
        playerData.name,
        playerData.fullName,
        playerData.email.toLowerCase(), // Normalize email
        finalUsername,
        playerData.phone,
        playerData.location,
        hashedPassword,
        playerData.role,
        playerData.status,
      ]
    );

    console.log('✅ Test player account created successfully!\n');
    console.log('📋 Account Details:');
    console.log(`   Email: ${playerData.email}`);
    console.log(`   Password: ${playerData.password}`);
    console.log(`   Name: ${playerData.name}`);
    console.log(`   Username: ${finalUsername}`);
    console.log(`   Role: ${playerData.role}`);
    console.log(`   Status: ${playerData.status}`);
    console.log(`   Location: ${playerData.location}`);
    console.log(`   User ID: ${result.insertId}`);
    console.log(`   UUID: ${uuid}`);
    console.log('\n🔐 Login Credentials:');
    console.log(`   Email: ${playerData.email}`);
    console.log(`   Password: ${playerData.password}`);
    console.log('\n💡 You can now use these credentials to test the player dashboard.');

    await pool.end();
  } catch (error) {
    console.error('❌ Error creating test player:', error);
    console.error('Error details:', error.message);
    await pool.end();
    process.exit(1);
  }
}

createTestPlayer();

