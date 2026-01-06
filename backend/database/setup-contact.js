import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), "..", ".env") });

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ajh_sports',
  port: process.env.DB_PORT || 3306,
};

async function createContactTable() {
  let connection;
  try {
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to database');

    // Read the SQL file
    const sqlPath = join(dirname(fileURLToPath(import.meta.url)), 'schema-contact.sql');
    const sql = readFileSync(sqlPath, 'utf-8');

    // Execute the SQL
    console.log('📝 Creating contact_messages table...');
    await connection.query(sql);
    console.log('✅ contact_messages table created successfully!');

    // Verify the table was created
    const [tables] = await connection.query("SHOW TABLES LIKE 'contact_messages'");
    if (tables.length > 0) {
      console.log('✅ Table verification: contact_messages exists');
      
      // Show table structure
      const [columns] = await connection.query("DESCRIBE contact_messages");
      console.log('\n📋 Table structure:');
      console.table(columns);
    }

  } catch (error) {
    if (error.code === 'ER_TABLE_EXISTS_ERROR') {
      console.log('ℹ️  Table contact_messages already exists');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('❌ Database access denied. Please check your .env file credentials:');
      console.error('   DB_HOST:', config.host);
      console.error('   DB_USER:', config.user);
      console.error('   DB_NAME:', config.database);
      console.error('   DB_PASS:', config.password ? '***set***' : '***NOT SET***');
      process.exit(1);
    } else if (error.code === 'ECONNREFUSED') {
      console.error('❌ Cannot connect to MySQL. Please make sure MySQL is running.');
      process.exit(1);
    } else {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

createContactTable();

