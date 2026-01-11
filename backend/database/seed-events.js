/**
 * Seed Events Script
 * Creates initial events in the database to match frontend display
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'ajh_sports',
};

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

async function seedEvents() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL');

    // Check if events table exists
    const [tables] = await connection.query(
      "SHOW TABLES LIKE 'events'"
    );
    
    if (tables.length === 0) {
      console.log('❌ Events table does not exist. Please run setup-extended.js first.');
      process.exit(1);
    }

    // Insert or update events
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
        console.log(`📝 Updated event: ${event.name} (ID: ${event.id})`);
      } else {
        // Insert new event with specific ID
        await connection.query(
          `INSERT INTO events (id, name, description, date, time, max_players, price, location, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [event.id, event.name, event.description, event.date, event.time, 
           event.max_players, event.price, event.location, event.status]
        );
        console.log(`✅ Created event: ${event.name} (ID: ${event.id})`);
      }
    }

    // Verify events were created
    const [allEvents] = await connection.query('SELECT id, name, max_players, price FROM events');
    console.log('\n📋 All events in database:');
    allEvents.forEach(e => {
      console.log(`   - ID ${e.id}: ${e.name} (${e.max_players} spots, $${e.price})`);
    });

    console.log('\n🎉 Events seeded successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding events:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedEvents();
