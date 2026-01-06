/**
 * Environment Setup Script
 * Creates .env file with database configuration if it doesn't exist
 * Usage: node database/setup-env.js
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const backendDir = join(__dirname, '..');
const envPath = join(backendDir, '.env');
const envExamplePath = join(backendDir, '.env.example');

const defaultEnv = `# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_PORT=3306
DB_NAME=ajh_sports

# Server Configuration
PORT=5001
NODE_ENV=development

# JWT Secret for authentication (will be auto-generated if missing)
# Run: npm run db:fix-admin-login to generate this automatically
JWT_SECRET=

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Stripe Configuration (if using payments)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
`;

async function setupEnv() {
  console.log('🔧 Environment Setup Tool\n');
  console.log('='.repeat(50));
  
  // Check if .env already exists
  if (existsSync(envPath)) {
    console.log('✅ .env file already exists');
    console.log(`   Location: ${envPath}`);
    console.log('\n💡 If you need to reset it, delete the file and run this script again.');
    return;
  }
  
  // Create .env.example if it doesn't exist
  if (!existsSync(envExamplePath)) {
    console.log('📝 Creating .env.example template...');
    writeFileSync(envExamplePath, defaultEnv);
    console.log('✅ Created .env.example');
  }
  
  // Create .env file
  console.log('\n📝 Creating .env file...');
  writeFileSync(envPath, defaultEnv);
  console.log('✅ Created .env file');
  console.log(`   Location: ${envPath}`);
  
  console.log('\n📋 Default Configuration:');
  console.log('   DB_HOST=localhost');
  console.log('   DB_USER=root');
  console.log('   DB_PASS= (empty - adjust if your MySQL requires a password)');
  console.log('   DB_PORT=3306');
  console.log('   DB_NAME=ajh_sports');
  console.log('   PORT=5001');
  console.log('   JWT_SECRET= (will be auto-generated)');
  
  console.log('\n⚠️  IMPORTANT NEXT STEPS:');
  console.log('   1. Edit .env file if your MySQL password is not empty:');
  console.log('      nano .env  (or use your preferred editor)');
  console.log('   2. Update DB_PASS if needed');
  console.log('   3. Run database setup:');
  console.log('      npm run db:setup');
  console.log('   4. Run admin login fix to generate JWT_SECRET:');
  console.log('      npm run db:fix-admin-login');
  console.log('   5. Restart your backend server:');
  console.log('      npm restart');
  console.log('');
}

setupEnv().catch(error => {
  console.error('❌ Error setting up environment:');
  console.error(error.message);
  process.exit(1);
});

