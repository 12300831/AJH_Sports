# Quick Start Guide - Frontend-Backend-Database Connection

## 🚀 Start Everything

### Step 1: Start Database
```bash
# macOS
brew services start mysql

# Verify MySQL is running
brew services list | grep mysql
```

### Step 2: Start Backend
```bash
cd backend
npm install  # If not already installed
npm start
```

**Expected output:**
```
✅ Backend running on port: 5001
🌍 Environment: development
🔗 Frontend URL: http://localhost:5173
```

### Step 3: Start Frontend
```bash
cd frontend
npm install  # If not already installed
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## ✅ Verify Connections

### Test Database
```bash
cd backend
npm run test-connection
```

### Test Backend API
```bash
curl http://localhost:5001/api/health
```

**Expected response:**
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "2024-...",
  "uptime": 123.45
}
```

### Test Frontend → Backend
1. Open browser: `http://localhost:5173`
2. Open DevTools (F12) → Console tab
3. Try logging in
4. Check Network tab for API calls

## 🔧 Configuration Files

### Backend `.env` (Required)
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=ajhsports2024
DB_NAME=ajh_sports
PORT=5001
JWT_SECRET=ajh_sports_jwt_secret_key_2024_secure_random_string
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env` (Optional)
```env
VITE_API_URL=http://localhost:5001/api
```

## 📡 API Endpoints

All API endpoints are prefixed with `/api`:

- **Auth**: `/api/auth/login`, `/api/auth/signup`
- **Users**: `/api/users/profile`
- **Events**: `/api/events`, `/api/events/bookings/my`
- **Coaches**: `/api/coaches`, `/api/coaches/bookings/my`
- **OAuth**: `/auth/google`, `/auth/facebook` (no `/api` prefix)

## 🐛 Troubleshooting

### Backend won't start
```bash
# Kill process on port 5001
cd backend
npm run kill-port

# Check .env file exists
cat backend/.env

# Restart
npm start
```

### Frontend can't connect to backend
1. Verify backend is running: `curl http://localhost:5001/api/health`
2. Check browser console for errors
3. Verify CORS allows `http://localhost:5173`

### Database connection fails
```bash
# Check MySQL is running
brew services list | grep mysql

# Test connection manually
mysql -u root -pajhsports2024 -e "USE ajh_sports; SELECT 1;"
```

## ✅ Success Checklist

- [ ] MySQL is running
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] `curl http://localhost:5001/api/health` returns JSON
- [ ] Login works in browser
- [ ] Dashboard loads user data
- [ ] No CORS errors in browser console

## 📚 More Information

See `CONNECTION_GUIDE.md` for detailed connection information.

