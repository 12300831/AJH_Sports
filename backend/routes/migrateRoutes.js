/**
 * Database Migration Routes
 * These endpoints help fix database schema issues
 */

import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// Fix event image columns (VARCHAR to TEXT for base64 images)
router.post('/events-image-columns', async (req, res) => {
  let connection;
  
  try {
    console.log('🔧 Fixing event image columns (VARCHAR → TEXT)...');
    
    connection = await pool.getConnection();
    
    // Check existing columns
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'events'
      AND COLUMN_NAME IN ('image_url', 'hero_image_url')
    `, [process.env.DB_NAME || 'ajh_sports']);
    
    const existingColumns = columns.map(col => ({
      name: col.COLUMN_NAME,
      type: col.DATA_TYPE,
      maxLength: col.CHARACTER_MAXIMUM_LENGTH
    }));
    
    const columnsToFix = [];
    
    const imageUrlCol = existingColumns.find(c => c.name === 'image_url');
    if (!imageUrlCol) {
      columnsToFix.push({ name: 'image_url', action: 'ADD COLUMN image_url TEXT NULL' });
    } else if (imageUrlCol.type === 'varchar') {
      columnsToFix.push({ name: 'image_url', action: 'MODIFY COLUMN image_url TEXT NULL' });
    }
    
    const heroImageUrlCol = existingColumns.find(c => c.name === 'hero_image_url');
    if (!heroImageUrlCol) {
      columnsToFix.push({ name: 'hero_image_url', action: 'ADD COLUMN hero_image_url TEXT NULL' });
    } else if (heroImageUrlCol.type === 'varchar') {
      columnsToFix.push({ name: 'hero_image_url', action: 'MODIFY COLUMN hero_image_url TEXT NULL' });
    }
    
    if (columnsToFix.length === 0) {
      return res.json({
        success: true,
        message: 'All image columns are already TEXT type',
        existingColumns
      });
    }
    
    // Fix columns
    for (const col of columnsToFix) {
      try {
        await connection.query(`ALTER TABLE events ${col.action}`);
        console.log(`✅ Fixed column: ${col.name} → TEXT`);
      } catch (err) {
        if (err.code !== 'ER_DUP_FIELDNAME') throw err;
      }
    }
    
    connection.release();
    
    res.json({
      success: true,
      message: `Fixed ${columnsToFix.length} column(s) to TEXT type`,
      fixedColumns: columnsToFix.map(c => c.name)
    });
    
  } catch (error) {
    if (connection) connection.release();
    console.error('Migration error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code
    });
  }
});

// Add missing columns to coaches table
router.post('/coaches-columns', async (req, res) => {
  let connection;
  
  try {
    console.log('🔧 Adding missing columns to coaches table...');
    
    connection = await pool.getConnection();
    
    // Check existing columns
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'coaches'
    `, [process.env.DB_NAME || 'ajh_sports']);
    
    const existingColumns = columns.map(col => col.COLUMN_NAME);
    const columnsToAdd = [];
    
    if (!existingColumns.includes('specialty')) {
      columnsToAdd.push({ name: 'specialty', type: 'VARCHAR(255)' });
    }
    
    if (!existingColumns.includes('availability')) {
      columnsToAdd.push({ name: 'availability', type: 'TEXT' });
    }
    
    if (columnsToAdd.length === 0) {
      return res.json({
        success: true,
        message: 'All required columns already exist',
        existingColumns
      });
    }
    
    // Add missing columns
    for (const col of columnsToAdd) {
      await connection.query(`ALTER TABLE coaches ADD COLUMN ${col.name} ${col.type}`);
      console.log(`✅ Added column: ${col.name}`);
    }
    
    connection.release();
    
    res.json({
      success: true,
      message: `Added ${columnsToAdd.length} column(s) to coaches table`,
      addedColumns: columnsToAdd.map(c => c.name)
    });
    
  } catch (error) {
    if (connection) connection.release();
    console.error('Migration error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code
    });
  }
});

// Seed events
router.post('/seed-events', async (req, res) => {
  let connection;
  
  try {
    console.log('🌱 Seeding events...');
    
    connection = await pool.getConnection();
    
    const events = [
      {
        id: 1,
        name: 'Tennis Open 2025',
        description: 'Annual tennis championship for all skill levels.',
        date: '2025-08-10',
        time: '09:00:00',
        max_players: 24,
        price: 30.00,
        location: 'AJH Sportscentre',
        status: 'active'
      },
      {
        id: 2,
        name: 'Table Tennis Tournament',
        description: 'Fast-paced table tennis action for all ages!',
        date: '2025-01-22',
        time: '10:00:00',
        max_players: 32,
        price: 35.00,
        location: 'AJH Sportscentre',
        status: 'active'
      },
      {
        id: 3,
        name: 'Kids Sports Party',
        description: 'Fun sports activities for kids aged 5-12.',
        date: '2025-02-01',
        time: '14:00:00',
        max_players: 20,
        price: 25.00,
        location: 'AJH Sportscentre',
        status: 'active'
      },
      {
        id: 4,
        name: '1-ON-1 Coaching',
        description: 'Personalized coaching with expert instructors.',
        date: '2025-12-31',
        time: '09:00:00',
        max_players: 100,
        price: 60.00,
        location: 'AJH Sportscentre',
        status: 'active'
      }
    ];
    
    let added = 0;
    let updated = 0;
    
    for (const event of events) {
      const [existing] = await connection.query(
        'SELECT id FROM events WHERE id = ?',
        [event.id]
      );

      if (existing.length > 0) {
        await connection.query(
          `UPDATE events SET 
            name = ?, description = ?, date = ?, time = ?, 
            max_players = ?, price = ?, location = ?, status = ?
           WHERE id = ?`,
          [event.name, event.description, event.date, event.time, 
           event.max_players, event.price, event.location, event.status, event.id]
        );
        updated++;
      } else {
        await connection.query(
          `INSERT INTO events (id, name, description, date, time, max_players, price, location, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [event.id, event.name, event.description, event.date, event.time, 
           event.max_players, event.price, event.location, event.status]
        );
        added++;
      }
    }

    connection.release();
    
    res.json({
      success: true,
      message: `Seeded ${events.length} events`,
      added,
      updated
    });
    
  } catch (error) {
    if (connection) connection.release();
    console.error('Seed events error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code
    });
  }
});

// Seed coaches
router.post('/seed-coaches', async (req, res) => {
  let connection;
  
  try {
    console.log('🌱 Seeding coaches...');
    
    connection = await pool.getConnection();
    
    const coaches = [
      {
        name: "Michael Rodriguez",
        specialty: "Advanced Techniques",
        email: "michael.rodriguez@ajhsports.com.au",
        phone: "+61 0412345678",
        availability: JSON.stringify([
          { day: "Monday", start: "17:00", end: "21:00" },
          { day: "Tuesday", start: "17:00", end: "21:00" },
          { day: "Wednesday", start: "17:00", end: "21:00" },
          { day: "Thursday", start: "17:00", end: "21:00" },
          { day: "Friday", start: "17:00", end: "21:00" },
          { day: "Saturday", start: "08:00", end: "12:00" },
        ]),
        hourly_rate: 80,
        status: "active",
      },
      {
        name: "James Wilson",
        specialty: "Serve Specialist",
        email: "james.wilson@ajhsports.com.au",
        phone: "+61 0412345679",
        availability: JSON.stringify([
          { day: "Monday", start: "09:00", end: "17:00" },
          { day: "Wednesday", start: "09:00", end: "17:00" },
          { day: "Friday", start: "09:00", end: "17:00" },
          { day: "Saturday", start: "09:00", end: "13:00" },
        ]),
        hourly_rate: 70,
        status: "active",
      },
      {
        name: "Mark Leo",
        specialty: "Junior Development",
        email: "mark.leo@ajhsports.com.au",
        phone: "+61 0412345680",
        availability: JSON.stringify([
          { day: "Tuesday", start: "15:00", end: "19:00" },
          { day: "Thursday", start: "15:00", end: "19:00" },
          { day: "Saturday", start: "09:00", end: "13:00" },
          { day: "Sunday", start: "09:00", end: "13:00" },
        ]),
        hourly_rate: 60,
        status: "active",
      },
      {
        name: "Kristin Russell",
        specialty: "Junior Development",
        email: "kristin.russell@ajhsports.com.au",
        phone: "+61 0412345681",
        availability: JSON.stringify([
          { day: "Monday", start: "15:00", end: "19:00" },
          { day: "Wednesday", start: "15:00", end: "19:00" },
          { day: "Friday", start: "15:00", end: "19:00" },
          { day: "Saturday", start: "10:00", end: "14:00" },
        ]),
        hourly_rate: 60,
        status: "active",
      },
    ];
    
    const [existing] = await connection.query("SELECT name FROM coaches");
    const existingNames = existing.map((c) => c.name);
    
    let added = 0;
    let skipped = 0;
    
    for (const coach of coaches) {
      if (existingNames.includes(coach.name)) {
        skipped++;
        continue;
      }
      
      await connection.query(
        `INSERT INTO coaches (name, specialty, email, phone, availability, hourly_rate, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          coach.name,
          coach.specialty,
          coach.email,
          coach.phone,
          coach.availability,
          coach.hourly_rate,
          coach.status,
        ]
      );
      
      added++;
    }

    connection.release();
    
    res.json({
      success: true,
      message: `Seeded ${coaches.length} coaches`,
      added,
      skipped
    });
    
  } catch (error) {
    if (connection) connection.release();
    console.error('Seed coaches error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code
    });
  }
});

// Seed both events and coaches
router.post('/seed-all', async (req, res) => {
  let connection;
  
  try {
    console.log('🌱 Seeding all data...');
    
    connection = await pool.getConnection();
    
    // Seed events
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
    
    // Seed coaches
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
      message: 'Seeded all data successfully',
      events: { total: events.length, added: eventsAdded, updated: eventsUpdated },
      coaches: { total: coaches.length, added: coachesAdded, skipped: coachesSkipped }
    });
    
  } catch (error) {
    if (connection) connection.release();
    console.error('Seed all error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code
    });
  }
});

export default router;
