/**
 * Initialize Azure MySQL Database
 * This script sets up all tables on Azure MySQL
 * Usage: node init-azure-db.js
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'ajh_sports',
  multipleStatements: true,
  ssl: {
    rejectUnauthorized: false // Azure MySQL requires SSL but allows self-signed certs
  }
};

async function initAzureDatabase() {
  let connection;
  
  try {
    console.log('🔌 Connecting to Azure MySQL...');
    console.log(`   Host: ${config.host}`);
    console.log(`   User: ${config.user}`);
    console.log(`   Port: ${config.port}`);
    
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL server\n');

    const dbName = process.env.DB_NAME || 'ajh_sports';
    
    // Use the database
    await connection.query(`USE \`${dbName}\``);
    console.log(`📦 Using database: ${dbName}\n`);

    // Step 1: Create users table if needed
    console.log('📋 Step 1: Creating users table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid VARCHAR(36) UNIQUE,
        name VARCHAR(255) NOT NULL,
        fullName VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(255) UNIQUE,
        phone VARCHAR(50),
        location VARCHAR(255),
        password VARCHAR(255),
        provider VARCHAR(50),
        provider_id VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user',
        status VARCHAR(50) DEFAULT 'Active',
        profileImage TEXT,
        joinedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        lastActive TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Users table ready\n');

    // Step 2: Read and execute extended schema
    console.log('📋 Step 2: Creating extended tables (events, coaches, bookings)...');
    const schemaPath = path.join(__dirname, 'database', 'schema-extended.sql');
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf8');
      await connection.query(schema);
      console.log('✅ Extended tables created\n');
    } else {
      console.log('⚠️  schema-extended.sql not found, creating tables manually...\n');
      
      // Create events table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS events (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          date DATE NOT NULL,
          time TIME NOT NULL,
          max_players INT NOT NULL DEFAULT 20,
          price DECIMAL(10, 2) DEFAULT 0.00,
          location VARCHAR(255),
          image_url VARCHAR(1024) NULL,
          hero_image_url VARCHAR(1024) NULL,
          status ENUM('active', 'inactive', 'cancelled', 'completed') DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_date (date),
          INDEX idx_status (status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      
      // Create event_bookings table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS event_bookings (
          id INT AUTO_INCREMENT PRIMARY KEY,
          event_id INT NOT NULL,
          user_id INT NOT NULL,
          payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
          stripe_session_id VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          UNIQUE KEY unique_booking (event_id, user_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      
      // Create coaches table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS coaches (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255),
          phone VARCHAR(50),
          specialization VARCHAR(255),
          bio TEXT,
          hourly_rate DECIMAL(10, 2) DEFAULT 0.00,
          image_url VARCHAR(1024) NULL,
          status ENUM('active', 'inactive') DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      
      // Create coach_bookings table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS coach_bookings (
          id INT AUTO_INCREMENT PRIMARY KEY,
          coach_id INT NOT NULL,
          user_id INT NOT NULL,
          booking_date DATE NOT NULL,
          booking_time TIME NOT NULL,
          payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
          stripe_session_id VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (coach_id) REFERENCES coaches(id) ON DELETE CASCADE,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      
      console.log('✅ Extended tables created manually\n');
    }

    // Step 3: Create contact table
    console.log('📋 Step 3: Creating contact table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        subject VARCHAR(255),
        message TEXT NOT NULL,
        status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Contact table created\n');

    // Step 4: Create admin user
    console.log('📋 Step 4: Creating admin user...');
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'admin';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    // Check if admin exists
    const [existingAdmins] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      [adminEmail]
    );
    
    if (existingAdmins.length === 0) {
      await connection.query(`
        INSERT INTO users (name, fullName, email, username, password, role, status)
        VALUES (?, ?, ?, ?, ?, 'admin', 'Active')
      `, ['Admin User', 'Admin User', adminEmail, 'admin', hashedPassword]);
      console.log('✅ Admin user created');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}\n`);
    } else {
      // Update existing user to admin
      await connection.query(
        'UPDATE users SET role = ?, password = ? WHERE email = ?',
        ['admin', hashedPassword, adminEmail]
      );
      console.log('✅ Admin user updated\n');
    }

    console.log('🎉 Database initialization complete!');
    console.log(`\n📊 Database: ${dbName}`);
    console.log('📝 Tables created:');
    console.log('   ✅ users');
    console.log('   ✅ events');
    console.log('   ✅ event_bookings');
    console.log('   ✅ coaches');
    console.log('   ✅ coach_bookings');
    console.log('   ✅ contact_messages');
    console.log('\n👤 Admin credentials:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);

  } catch (error) {
    console.error('❌ Error initializing database:');
    console.error(error.message);
    if (error.code) {
      console.error(`Error code: ${error.code}`);
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

initAzureDatabase();
