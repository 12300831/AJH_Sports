/**
 * Script to add coaches from frontend to backend database
 * Run with: node database/add-coaches-from-frontend.js
 */

import pool from "../config/db.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, "..", ".env");

dotenv.config({ path: envPath });

// Coaches data extracted from frontend
const coaches = [
  {
    name: "Michael Rodriguez",
    specialty: "Advanced Techniques",
    email: "michael.rodriguez@ajhsports.com.au",
    phone: "+61 0412345678",
    availability: [
      { day: "Monday", start: "17:00", end: "21:00" },
      { day: "Tuesday", start: "17:00", end: "21:00" },
      { day: "Wednesday", start: "17:00", end: "21:00" },
      { day: "Thursday", start: "17:00", end: "21:00" },
      { day: "Friday", start: "17:00", end: "21:00" },
      { day: "Saturday", start: "08:00", end: "12:00" },
    ],
    hourly_rate: 80,
    status: "active",
  },
  {
    name: "James Wilson",
    specialty: "Serve Specialist",
    email: "james.wilson@ajhsports.com.au",
    phone: "+61 0412345679",
    availability: [
      { day: "Monday", start: "09:00", end: "17:00" },
      { day: "Wednesday", start: "09:00", end: "17:00" },
      { day: "Friday", start: "09:00", end: "17:00" },
      { day: "Saturday", start: "09:00", end: "13:00" },
    ],
    hourly_rate: 70,
    status: "active",
  },
  {
    name: "Mark Leo",
    specialty: "Junior Development",
    email: "mark.leo@ajhsports.com.au",
    phone: "+61 0412345680",
    availability: [
      { day: "Tuesday", start: "15:00", end: "19:00" },
      { day: "Thursday", start: "15:00", end: "19:00" },
      { day: "Saturday", start: "09:00", end: "13:00" },
      { day: "Sunday", start: "09:00", end: "13:00" },
    ],
    hourly_rate: 60,
    status: "active",
  },
  {
    name: "Kristin Russell",
    specialty: "Junior Development",
    email: "kristin.russell@ajhsports.com.au",
    phone: "+61 0412345681",
    availability: [
      { day: "Monday", start: "15:00", end: "19:00" },
      { day: "Wednesday", start: "15:00", end: "19:00" },
      { day: "Friday", start: "15:00", end: "19:00" },
      { day: "Saturday", start: "10:00", end: "14:00" },
    ],
    hourly_rate: 60,
    status: "active",
  },
];

async function addCoaches() {
  try {
    console.log("Connecting to database...");
    
    // Check if coaches already exist
    const [existing] = await pool.query("SELECT name FROM coaches");
    const existingNames = existing.map((c) => c.name);
    
    console.log(`Found ${existing.length} existing coaches in database.`);
    
    let added = 0;
    let skipped = 0;
    
    for (const coach of coaches) {
      // Check if coach already exists
      if (existingNames.includes(coach.name)) {
        console.log(`⏭️  Skipping ${coach.name} - already exists`);
        skipped++;
        continue;
      }
      
      // Convert availability array to JSON string
      const availabilityString = JSON.stringify(coach.availability);
      
      // Insert coach
      const [result] = await pool.query(
        `INSERT INTO coaches (name, specialty, email, phone, availability, hourly_rate, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          coach.name,
          coach.specialty,
          coach.email,
          coach.phone,
          availabilityString,
          coach.hourly_rate,
          coach.status,
        ]
      );
      
      console.log(`✅ Added: ${coach.name} (ID: ${result.insertId})`);
      added++;
    }
    
    console.log("\n📊 Summary:");
    console.log(`   Added: ${added} coaches`);
    console.log(`   Skipped: ${skipped} coaches (already exist)`);
    console.log(`   Total: ${coaches.length} coaches processed`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error adding coaches:", error);
    process.exit(1);
  }
}

addCoaches();
