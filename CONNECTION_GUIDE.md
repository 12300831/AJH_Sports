# Frontend-Backend-Database Connection Guide

This guide ensures all components are properly connected and communicating.

## ✅ Connection Status

### Database Connection
- **Status**: ✅ Connected
- **Database**: `ajh_sports`
- **Host**: `localhost`
- **User**: `root@localhost`

### Backend Server
- **Port**: `5001`
- **Base URL**: `http://localhost:5001`
- **API Base**: `http://localhost:5001/api`

### Frontend
- **Port**: `5173` (Vite default)
- **Base URL**: `http://localhost:5173`
- **API URL**: `http://localhost:5001/api`

## 🔧 Configuration Files

### Backend `.env`
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=ajhsports2024
DB_NAME=ajh_sports
PORT=5001
NODE_ENV=development
JWT_SECRET=ajh_sports_jwt_secret_key_2024_secure_random_string
FRONTEND_URL=http://localhost:5173

# OAuth Configuration
SESSION_SECRET=ajh_sports_session_secret_key_2024_secure_random_string
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
FACEBOOK_APP_ID=756002966781845
FACEBOOK_APP_SECRET=2f00f4b24b0016b5ac80769b94202eb7
```

### Frontend `.env` (Optional)
```env
VITE_API_URL=http://localhost:5001/api
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### OAuth
- `GET /auth/google` - Google OAuth initiation
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/facebook` - Facebook OAuth initiation
- `GET /auth/facebook/callback` - Facebook OAuth callback

### User Profile
- `GET /api/users/profile` - Get user profile (authenticated)
- `PUT /api/users/profile` - Update user profile (authenticated)

### Events
- `GET /api/events` - List all events (public)
- `GET /api/events/:id` - Get event details (public)
- `POST /api/events/book` - Book event (authenticated)
- `POST /api/events/cancel/:id` - Cancel booking (authenticated)
- `GET /api/events/bookings/my` - Get my bookings (authenticated)

### Coaches
- `GET /api/coaches` - List all coaches (public)
- `GET /api/coaches/:id` - Get coach details (public)
- `POST /api/coaches/book` - Book coach session (authenticated)
- `POST /api/coaches/cancel/:id` - Cancel booking (authenticated)
- `GET /api/coaches/bookings/my` - Get my bookings (authenticated)

### Admin
- `GET /api/users/admin` - List all users (admin)
- `GET /api/users/admin/:id` - Get user by ID (admin)
- `POST /api/users/admin` - Create user (admin)
- `PUT /api/users/admin/:id` - Update user (admin)
- `DELETE /api/users/admin/:id` - Delete user (admin)

## 🧪 Testing Connections

### Test Database Connection
```bash
cd backend
node scripts/testConnection.js
```

### Test Backend API
```bash
# Health check
curl http://localhost:5001/api/health

# Test login (replace with real credentials)
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"admin"}'
```

### Test Frontend Connection
1. Start backend: `cd backend && npm start`
2. Start frontend: `cd frontend && npm run dev`
3. Open browser: `http://localhost:5173`
4. Check browser console for API calls

## 🔄 Data Flow

### Login Flow
1. User enters credentials in frontend
2. Frontend sends `POST /api/auth/login` to backend
3. Backend queries database for user
4. Backend validates password
5. Backend generates JWT token
6. Frontend stores token in localStorage
7. Frontend redirects to dashboard

### Dashboard Data Flow
1. Frontend reads token from localStorage
2. Frontend sends authenticated requests:
   - `GET /api/users/profile` - User profile
   - `GET /api/events/bookings/my` - Event bookings
   - `GET /api/coaches/bookings/my` - Coach bookings
3. Backend validates JWT token
4. Backend queries database for user data
5. Backend returns JSON response
6. Frontend displays data in dashboard

## 🛠️ Troubleshooting

### Database Connection Issues
```bash
# Check MySQL is running
brew services list | grep mysql

# Start MySQL
brew services start mysql

# Test connection manually
mysql -u root -pajhsports2024 -e "USE ajh_sports; SELECT 1;"
```

### Backend Not Starting
```bash
# Check if port is in use
lsof -ti:5001 | xargs kill -9

# Verify .env file exists
cat backend/.env

# Check for missing dependencies
cd backend && npm install
```

### Frontend Can't Connect to Backend
1. Verify backend is running: `curl http://localhost:5001/api/health`
2. Check CORS settings in `backend/server.js`
3. Verify `VITE_API_URL` in frontend `.env` (optional)
4. Check browser console for CORS errors

### Authentication Issues
1. Verify JWT_SECRET is set in backend `.env`
2. Check token is stored: `localStorage.getItem('token')` in browser console
3. Verify token format: Should start with `eyJ...`
4. Check backend logs for authentication errors

## 📋 Quick Start Checklist

- [ ] MySQL is running
- [ ] Database `ajh_sports` exists
- [ ] Backend `.env` is configured
- [ ] Backend server starts without errors
- [ ] Frontend can access `http://localhost:5001/api/health`
- [ ] Login works and token is stored
- [ ] Dashboard loads user data
- [ ] API requests include Authorization header

## 🎯 Verification Commands

```bash
# Test database
cd backend && node scripts/testConnection.js

# Test backend API
curl http://localhost:5001/api/health

# Check backend logs
cd backend && npm start

# Check frontend console
# Open browser DevTools → Console tab
```

## ✅ Success Indicators

- ✅ Database connection test passes
- ✅ Backend health endpoint returns `{"status":"ok"}`
- ✅ Login returns JWT token
- ✅ Dashboard displays user data
- ✅ No CORS errors in browser console
- ✅ API requests return 200 status codes

