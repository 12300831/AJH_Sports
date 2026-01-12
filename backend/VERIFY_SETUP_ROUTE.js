/**
 * Verification script to ensure setupRoutes.js is properly configured
 * Run: node VERIFY_SETUP_ROUTE.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n🔍 Verifying /api/setup route configuration...\n');

let allGood = true;

// 1. Check if setupRoutes.js exists
const setupRoutesPath = path.join(__dirname, 'routes', 'setupRoutes.js');
if (fs.existsSync(setupRoutesPath)) {
  console.log('✅ setupRoutes.js exists');
  
  // Check file content
  const content = fs.readFileSync(setupRoutesPath, 'utf8');
  
  if (content.includes("router.post('/setup'")) {
    console.log('✅ Route handler found: router.post(\'/setup\'');
  } else {
    console.log('❌ Route handler NOT found');
    allGood = false;
  }
  
  if (content.includes('export default router')) {
    console.log('✅ Export statement found: export default router');
  } else {
    console.log('❌ Export statement NOT found');
    allGood = false;
  }
  
  const fileSize = fs.statSync(setupRoutesPath).size;
  console.log(`✅ File size: ${fileSize} bytes`);
} else {
  console.log('❌ setupRoutes.js DOES NOT EXIST!');
  allGood = false;
}

// 2. Check server.js
const serverPath = path.join(__dirname, 'server.js');
if (fs.existsSync(serverPath)) {
  console.log('\n✅ server.js exists');
  
  const serverContent = fs.readFileSync(serverPath, 'utf8');
  
  if (serverContent.includes('import setupRoutes from "./routes/setupRoutes.js"')) {
    console.log('✅ Import statement found in server.js');
  } else {
    console.log('❌ Import statement NOT found in server.js');
    allGood = false;
  }
  
  if (serverContent.includes('app.use("/api/setup", setupRoutes)')) {
    console.log('✅ Route registration found: app.use("/api/setup", setupRoutes)');
  } else {
    console.log('❌ Route registration NOT found in server.js');
    allGood = false;
  }
} else {
  console.log('\n❌ server.js DOES NOT EXIST!');
  allGood = false;
}

// 3. Summary
console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('✅ ALL CHECKS PASSED! File is ready for deployment.');
  console.log('\n📋 Next steps:');
  console.log('   1. Deploy from VS Code (Azure panel → Deploy)');
  console.log('   2. After deployment, test: POST /api/setup');
  process.exit(0);
} else {
  console.log('❌ SOME CHECKS FAILED! Please fix the issues above.');
  process.exit(1);
}
