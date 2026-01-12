/**
 * Database Setup Routes
 * These endpoints initialize the database tables
 * WARNING: Only use in development or with proper authentication
 */

import express from 'express';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/db.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup endpoint - creates all tables
// NOTE: Mounted at /api/setup in server.js, so use root path here.
router.post('/', async (req, res) => {
  let connection;
  
  try {
    console.log('🔧 Database setup initiated via API...');
    
    connection = await pool.getConnection();
    const dbName = process.env.DB_NAME || 'ajh_sports';
    
    // Step 1: Ensure users table has all columns
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
    
    // Add columns if they don't exist
    const columnsToAdd = [
      { name: 'uuid', type: 'VARCHAR(36) UNIQUE' },
      { name: 'fullName', type: 'VARCHAR(255)' },
      { name: 'username', type: 'VARCHAR(255) UNIQUE' },
      { name: 'provider', type: 'VARCHAR(50)' },
      { name: 'provider_id', type: 'VARCHAR(255)' },
      { name: 'role', type: "VARCHAR(50) DEFAULT 'user'" },
      { name: 'status', type: "VARCHAR(50) DEFAULT 'Active'" },
      { name: 'profileImage', type: 'TEXT' },
      { name: 'joinedDate', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' },
      { name: 'lastActive', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }
    ];
    
    for (const col of columnsToAdd) {
      try {
        await connection.query(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`);
      } catch (err) {
        if (err.code !== 'ER_DUP_FIELDNAME') throw err;
      }
    }
    
    // Step 2: Create events table
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
        image_url TEXT NULL,
        hero_image_url TEXT NULL,
        status ENUM('active', 'inactive', 'cancelled', 'completed') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_date (date),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // Step 3: Create event_bookings table
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
    
    // Step 4: Create coaches table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS coaches (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50),
        specialty VARCHAR(255),
        specialization VARCHAR(255),
        availability TEXT,
        bio TEXT,
        hourly_rate DECIMAL(10, 2) DEFAULT 0.00,
        image_url VARCHAR(1024) NULL,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // Add missing columns if they don't exist
    const coachColumnsToAdd = [
      { name: 'specialty', type: 'VARCHAR(255)' },
      { name: 'availability', type: 'TEXT' }
    ];
    
    for (const col of coachColumnsToAdd) {
      try {
        await connection.query(`ALTER TABLE coaches ADD COLUMN ${col.name} ${col.type}`);
      } catch (err) {
        if (err.code !== 'ER_DUP_FIELDNAME') throw err;
      }
    }
    
    // Step 5: Create coach_bookings table
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
    
    // Step 6: Create contact_messages table
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
    
    // Step 7: Create admin user
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'admin';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const [existingAdmins] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      [adminEmail]
    );
    
    if (existingAdmins.length === 0) {
      await connection.query(`
        INSERT INTO users (name, fullName, email, username, password, role, status)
        VALUES (?, ?, ?, ?, ?, 'admin', 'Active')
      `, ['Admin User', 'Admin User', adminEmail, 'admin', hashedPassword]);
    } else {
      await connection.query(
        'UPDATE users SET role = ?, password = ? WHERE email = ?',
        ['admin', hashedPassword, adminEmail]
      );
    }
    
    // Seed events and coaches after setup
    console.log('🌱 Seeding initial data...');
    
    const events = [
      { id: 1, name: 'Tennis Open 2025', description: 'Annual tennis championship for all skill levels.', date: '2025-08-10', time: '09:00:00', max_players: 24, price: 30.00, location: 'AJH Sportscentre', status: 'active' },
      { id: 2, name: 'Table Tennis Tournament', description: 'Fast-paced table tennis action for all ages!', date: '2025-01-22', time: '10:00:00', max_players: 32, price: 35.00, location: 'AJH Sportscentre', status: 'active' },
      { id: 3, name: 'Kids Sports Party', description: 'Fun sports activities for kids aged 5-12.', date: '2025-02-01', time: '14:00:00', max_players: 20, price: 25.00, location: 'AJH Sportscentre', status: 'active' },
      { id: 4, name: '1-ON-1 Coaching', description: 'Personalized coaching with expert instructors.', date: '2025-12-31', time: '09:00:00', max_players: 100, price: 60.00, location: 'AJH Sportscentre', status: 'active' }
    ];
    
    let eventsAdded = 0, eventsUpdated = 0;
    for (const event of events) {
      const [existing] = await connection.query('SELECT id FROM events WHERE id = ?', [event.id]);
      if (existing.length > 0) {
        await connection.query(`UPDATE events SET name = ?, description = ?, date = ?, time = ?, max_players = ?, price = ?, location = ?, status = ? WHERE id = ?`,
          [event.name, event.description, event.date, event.time, event.max_players, event.price, event.location, event.status, event.id]);
        eventsUpdated++;
      } else {
        await connection.query(`INSERT INTO events (id, name, description, date, time, max_players, price, location, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [event.id, event.name, event.description, event.date, event.time, event.max_players, event.price, event.location, event.status]);
        eventsAdded++;
      }
    }
    
    const coaches = [
      { name: "Michael Rodriguez", specialty: "Advanced Techniques", email: "michael.rodriguez@ajhsports.com.au", phone: "+61 0412345678", availability: JSON.stringify([{ day: "Monday", start: "17:00", end: "21:00" }, { day: "Tuesday", start: "17:00", end: "21:00" }, { day: "Wednesday", start: "17:00", end: "21:00" }, { day: "Thursday", start: "17:00", end: "21:00" }, { day: "Friday", start: "17:00", end: "21:00" }, { day: "Saturday", start: "08:00", end: "12:00" }]), hourly_rate: 80, status: "active" },
      { name: "James Wilson", specialty: "Serve Specialist", email: "james.wilson@ajhsports.com.au", phone: "+61 0412345679", availability: JSON.stringify([{ day: "Monday", start: "09:00", end: "17:00" }, { day: "Wednesday", start: "09:00", end: "17:00" }, { day: "Friday", start: "09:00", end: "17:00" }, { day: "Saturday", start: "09:00", end: "13:00" }]), hourly_rate: 70, status: "active" },
      { name: "Mark Leo", specialty: "Junior Development", email: "mark.leo@ajhsports.com.au", phone: "+61 0412345680", availability: JSON.stringify([{ day: "Tuesday", start: "15:00", end: "19:00" }, { day: "Thursday", start: "15:00", end: "19:00" }, { day: "Saturday", start: "09:00", end: "13:00" }, { day: "Sunday", start: "09:00", end: "13:00" }]), hourly_rate: 60, status: "active" },
      { name: "Kristin Russell", specialty: "Junior Development", email: "kristin.russell@ajhsports.com.au", phone: "+61 0412345681", availability: JSON.stringify([{ day: "Monday", start: "15:00", end: "19:00" }, { day: "Wednesday", start: "15:00", end: "19:00" }, { day: "Friday", start: "15:00", end: "19:00" }, { day: "Saturday", start: "10:00", end: "14:00" }]), hourly_rate: 60, status: "active" }
    ];
    
    const [existingCoaches] = await connection.query("SELECT name FROM coaches");
    const existingNames = existingCoaches.map((c) => c.name);
    let coachesAdded = 0, coachesSkipped = 0;
    for (const coach of coaches) {
      if (existingNames.includes(coach.name)) {
        coachesSkipped++;
        continue;
      }
      await connection.query(`INSERT INTO coaches (name, specialty, email, phone, availability, hourly_rate, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [coach.name, coach.specialty, coach.email, coach.phone, coach.availability, coach.hourly_rate, coach.status]);
      coachesAdded++;
    }
    
    connection.release();
    
    res.json({
      success: true,
      message: 'Database initialized and seeded successfully',
      tables: ['users', 'events', 'event_bookings', 'coaches', 'coach_bookings', 'contact_messages'],
      admin: {
        email: adminEmail,
        password: adminPassword
      },
      seeded: {
        events: { total: events.length, added: eventsAdded, updated: eventsUpdated },
        coaches: { total: coaches.length, added: coachesAdded, skipped: coachesSkipped }
      }
    });
    
  } catch (error) {
    if (connection) connection.release();
    console.error('Setup error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code
    });
  }
});

export default router;
