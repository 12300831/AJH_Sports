/**
 * Script to set DB_PASS in .env file
 * Usage: node set-db-password.js <password>
 * Or: node set-db-password.js (will prompt)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '.env');

function updateEnvPassword(password) {
  if (!existsSync(envPath)) {
    console.error('❌ .env file does not exist!');
    console.error(`   Expected: ${envPath}`);
    process.exit(1);
  }

  // Read current .env file
  let envContent = readFileSync(envPath, 'utf8');
  
  // Check if DB_PASS line exists
  const dbPassRegex = /^DB_PASS=.*$/m;
  
  if (dbPassRegex.test(envContent)) {
    // Replace existing DB_PASS
    envContent = envContent.replace(dbPassRegex, `DB_PASS=${password}`);
    console.log('✅ Updated existing DB_PASS in .env file');
  } else {
    // Add DB_PASS if it doesn't exist
    // Try to add it after DB_USER
    if (envContent.includes('DB_USER=')) {
      envContent = envContent.replace(
        /^(DB_USER=.*)$/m,
        `$1\nDB_PASS=${password}`
      );
      console.log('✅ Added DB_PASS to .env file');
    } else {
      // Just append it
      envContent += `\nDB_PASS=${password}\n`;
      console.log('✅ Appended DB_PASS to .env file');
    }
  }
  
  // Write back to file
  writeFileSync(envPath, envContent);
  console.log(`\n✅ Successfully set DB_PASS in .env file`);
  console.log(`   File: ${envPath}`);
  console.log(`   Password: ${'*'.repeat(password.length)}`);
}

// Get password from command line argument or prompt
const password = process.argv[2];

if (password) {
  updateEnvPassword(password);
} else {
  // Prompt for password
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('🔐 Set MySQL Database Password\n');
  console.log('Enter your MySQL root password (or press Enter to set a new one):');
  
  rl.question('Password: ', (inputPassword) => {
    if (!inputPassword || inputPassword.trim() === '') {
      console.log('\n⚠️  No password provided.');
      console.log('💡 To set a new MySQL password, run:');
      console.log('   sudo mysql');
      console.log('   Then in MySQL:');
      console.log('   ALTER USER \'root\'@\'localhost\' IDENTIFIED BY \'your_password\';');
      console.log('   FLUSH PRIVILEGES;');
      console.log('   EXIT;');
      console.log('\nThen run this script again with the password:');
      console.log('   node set-db-password.js your_password');
      rl.close();
      process.exit(1);
    }
    
    updateEnvPassword(inputPassword.trim());
    rl.close();
    
    console.log('\n💡 Next steps:');
    console.log('   1. Restart your backend server: npm restart');
    console.log('   2. Test the connection: node database/test-db-connection.js');
  });
}

