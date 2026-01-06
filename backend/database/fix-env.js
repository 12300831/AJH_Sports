/**
 * Fix Environment Configuration
 * Adds missing database variables to .env file
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env');

console.log('🔧 Fixing Environment Configuration\n');
console.log('='.repeat(50));

if (!existsSync(envPath)) {
  console.error('❌ .env file does not exist!');
  console.error(`   Expected: ${envPath}`);
  process.exit(1);
}

// Read existing .env file
let envContent = readFileSync(envPath, 'utf8');

// Check what's missing
const requiredVars = {
  'DB_HOST': 'localhost',
  'DB_USER': 'root',
  'DB_PASS': '',
  'DB_PORT': '3306',
  'DB_NAME': 'ajh_sports',
};

let addedVars = [];
let updated = false;

// Add missing variables
for (const [key, defaultValue] of Object.entries(requiredVars)) {
  const regex = new RegExp(`^${key}=`, 'm');
  if (!regex.test(envContent)) {
    // Variable is missing, add it
    if (!envContent.endsWith('\n') && envContent.length > 0) {
      envContent += '\n';
    }
    
    if (key === 'DB_PASS') {
      envContent += `# Database Configuration\n${key}=${defaultValue}  # Leave empty if no password, or add your MySQL password\n`;
    } else {
      envContent += `${key}=${defaultValue}\n`;
    }
    addedVars.push(key);
    updated = true;
  } else {
    // Check if value is empty
    const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'));
    if (match && match[1].trim() === '') {
      console.log(`⚠️  ${key} exists but is empty`);
    }
  }
}

if (updated) {
  // Write back to file
  writeFileSync(envPath, envContent);
  console.log('\n✅ Successfully updated .env file!');
  console.log('\n📝 Added variables:');
  addedVars.forEach(v => console.log(`   - ${v}`));
  
  console.log('\n⚠️  IMPORTANT NEXT STEPS:');
  console.log('   1. If your MySQL root user has a password, edit .env and update DB_PASS:');
  console.log('      DB_PASS=your_mysql_password');
  console.log('   2. Restart your backend server:');
  console.log('      npm restart');
  console.log('   3. Try logging in again\n');
} else {
  console.log('\n✅ All required database variables are already in .env file!');
  console.log('\n💡 If you still get errors, check:');
  console.log('   1. DB_USER and DB_PASS are set correctly');
  console.log('   2. MySQL is running');
  console.log('   3. MySQL user and password match your .env settings\n');
}

