/**
 * Seed Events and Coaches Data to Azure MySQL
 * Connects directly to Azure and seeds the data
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
  host: process.env.DB_HOST || 'ajh-sports-mysql.mysql.database.azure.com',
  user: process.env.DB_USER || 'ajhsportsadmin@ajh-sports-mysql',
  password: process.env.DB_PASS || 'Team404ajhsports',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'ajh_sports',
  ssl: {
    rejectUnauthorized: false
  }
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

async function seedData() {
  let connection;
  
  try {
    console.log('🔌 Connecting to Azure MySQL...');
    console.log(`   Host: ${config.host}`);
    console.log(`   Database: ${config.database}\n`);
    
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL\n');
    
    // Seed events
    console.log('🌱 Seeding events...');
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
        console.log(`   📝 Updated: ${event.name}`);
      } else {
        await connection.query(
          `INSERT INTO events (id, name, description, date, time, max_players, price, location, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [event.id, event.name, event.description, event.date, event.time, 
           event.max_players, event.price, event.location, event.status]
        );
        eventsAdded++;
        console.log(`   ✅ Added: ${event.name}`);
      }
    }
    
    console.log(`\n📊 Events: ${eventsAdded} added, ${eventsUpdated} updated\n`);
    
    // Seed coaches
    console.log('🌱 Seeding coaches...');
    const [existingCoaches] = await connection.query("SELECT name FROM coaches");
    const existingNames = existingCoaches.map((c) => c.name);
    
    let coachesAdded = 0;
    let coachesSkipped = 0;
    
    for (const coach of coaches) {
      if (existingNames.includes(coach.name)) {
        coachesSkipped++;
        console.log(`   ⏭️  Skipped: ${coach.name} (already exists)`);
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
      console.log(`   ✅ Added: ${coach.name}`);
    }
    
    console.log(`\n📊 Coaches: ${coachesAdded} added, ${coachesSkipped} skipped\n`);
    
    await connection.end();
    
    console.log('🎉 Seeding completed successfully!');
    console.log(`\n✅ Summary:`);
    console.log(`   Events: ${events.length} total (${eventsAdded} added, ${eventsUpdated} updated)`);
    console.log(`   Coaches: ${coaches.length} total (${coachesAdded} added, ${coachesSkipped} skipped)`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('   Code:', error.code);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

seedData();
