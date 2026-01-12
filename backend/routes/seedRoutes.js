/**
 * Seed Data Routes
 * Seeds events and coaches data to the database
 */

import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// Events data
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

// Coaches data
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

// Seed events
router.post('/events', async (req, res) => {
  let connection;
  
  try {
    console.log('🌱 Seeding events...');
    
    connection = await pool.getConnection();
    
    let added = 0;
    let updated = 0;
    
    for (const event of events) {
      // Check if event with this ID already exists
      const [existing] = await connection.query(
        'SELECT id FROM events WHERE id = ?',
        [event.id]
      );

      if (existing.length > 0) {
        // Update existing event
        await connection.query(
          `UPDATE events SET 
            name = ?, description = ?, date = ?, time = ?, 
            max_players = ?, price = ?, location = ?, status = ?
           WHERE id = ?`,
          [event.name, event.description, event.date, event.time, 
           event.max_players, event.price, event.location, event.status, event.id]
        );
        updated++;
        console.log(`📝 Updated event: ${event.name} (ID: ${event.id})`);
      } else {
        // Insert new event with specific ID
        await connection.query(
          `INSERT INTO events (id, name, description, date, time, max_players, price, location, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [event.id, event.name, event.description, event.date, event.time, 
           event.max_players, event.price, event.location, event.status]
        );
        added++;
        console.log(`✅ Created event: ${event.name} (ID: ${event.id})`);
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
router.post('/coaches', async (req, res) => {
  let connection;
  
  try {
    console.log('🌱 Seeding coaches...');
    
    connection = await pool.getConnection();
    
    // Get existing coaches
    const [existing] = await connection.query("SELECT name FROM coaches");
    const existingNames = existing.map((c) => c.name);
    
    let added = 0;
    let skipped = 0;
    
    for (const coach of coaches) {
      // Check if coach already exists
      if (existingNames.includes(coach.name)) {
        skipped++;
        continue;
      }
      
      // Insert coach
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
      console.log(`✅ Added coach: ${coach.name}`);
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
router.post('/all', async (req, res) => {
  let connection;
  
  try {
    console.log('🌱 Seeding all data...');
    
    connection = await pool.getConnection();
    
    // Seed events
    let eventsAdded = 0;
    let eventsUpdated = 0;
    
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
        eventsUpdated++;
      } else {
        await connection.query(
          `INSERT INTO events (id, name, description, date, time, max_players, price, location, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [event.id, event.name, event.description, event.date, event.time, 
           event.max_players, event.price, event.location, event.status]
        );
        eventsAdded++;
      }
    }
    
    // Seed coaches
    const [existingCoaches] = await connection.query("SELECT name FROM coaches");
    const existingNames = existingCoaches.map((c) => c.name);
    
    let coachesAdded = 0;
    let coachesSkipped = 0;
    
    for (const coach of coaches) {
      if (existingNames.includes(coach.name)) {
        coachesSkipped++;
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
      
      coachesAdded++;
    }

    connection.release();
    
    res.json({
      success: true,
      message: 'Seeded all data successfully',
      events: {
        total: events.length,
        added: eventsAdded,
        updated: eventsUpdated
      },
      coaches: {
        total: coaches.length,
        added: coachesAdded,
        skipped: coachesSkipped
      }
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
