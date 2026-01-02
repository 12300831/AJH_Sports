/**
 * Test Login Endpoint
 * Tests the login functionality directly
 */

import dotenv from 'dotenv';
dotenv.config();

const API_URL = 'http://localhost:5001/api';

async function testLogin() {
  try {
    console.log('🧪 Testing login endpoint...\n');
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@gmail.com',
        password: 'admin'
      }),
    });

    const data = await response.json();
    
    console.log('📥 Response status:', response.status);
    console.log('📥 Response data:', JSON.stringify(data, null, 2));
    console.log('\n👤 User object:', data.user);
    console.log('🔑 Role value:', data.user?.role);
    console.log('🔑 Role type:', typeof data.user?.role);
    console.log('🔑 Role === "admin":', data.user?.role === 'admin');
    
    if (data.user?.role === 'admin') {
      console.log('\n✅ SUCCESS: Role is correctly set to "admin"');
    } else {
      console.log('\n❌ ERROR: Role is not "admin"');
      console.log('   Expected: "admin"');
      console.log('   Got:', data.user?.role);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testLogin();

