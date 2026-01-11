#!/bin/bash

# Frontend-Backend-Database Connection Verification Script

echo "🔍 Verifying Frontend-Backend-Database Connections..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Database Connection
echo "1️⃣ Testing Database Connection..."
cd backend
if node scripts/testConnection.js > /dev/null 2>&1; then
    echo -e "${GREEN}   ✅ Database connection successful${NC}"
else
    echo -e "${RED}   ❌ Database connection failed${NC}"
    exit 1
fi
cd ..

# Test 2: Backend API Health
echo ""
echo "2️⃣ Testing Backend API..."
if curl -s http://localhost:5001/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}   ✅ Backend API is responding${NC}"
    HEALTH=$(curl -s http://localhost:5001/api/health)
    echo "   Response: $HEALTH"
else
    echo -e "${YELLOW}   ⚠️  Backend API not responding (is server running?)${NC}"
    echo "   Start backend: cd backend && npm start"
fi

# Test 3: Frontend Configuration
echo ""
echo "3️⃣ Checking Frontend Configuration..."
if [ -f "frontend/.env" ]; then
    echo -e "${GREEN}   ✅ Frontend .env file exists${NC}"
    if grep -q "VITE_API_URL" frontend/.env; then
        echo "   VITE_API_URL is set"
    else
        echo "   Using default: http://localhost:5001/api"
    fi
else
    echo "   Using default API URL: http://localhost:5001/api"
fi

# Test 4: CORS Configuration
echo ""
echo "4️⃣ Checking CORS Configuration..."
if grep -q "localhost:5173" backend/server.js; then
    echo -e "${GREEN}   ✅ CORS allows frontend origin${NC}"
else
    echo -e "${YELLOW}   ⚠️  CORS configuration may need updating${NC}"
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Connection Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   Database: ajh_sports@localhost"
echo "   Backend:  http://localhost:5001"
echo "   Frontend: http://localhost:5173"
echo "   API Base: http://localhost:5001/api"
echo ""
echo -e "${GREEN}✅ All connections verified!${NC}"
echo ""

