# ✅ Backend Deployment Checklist

## Critical Files Verified

### Core Application Files
- ✅ `server.js` - Main server file
- ✅ `package.json` - Dependencies and scripts
- ✅ `.deployment` - Azure deployment configuration
- ✅ `startup.sh` - Azure startup script

### Configuration Files
- ✅ `config/db.js` - Database connection (with SSL for Azure MySQL)
- ✅ `config/passport.js` - OAuth authentication
- ✅ `config/stripe.js` - Payment processing

### Route Files
- ✅ `routes/setupRoutes.js` - Database initialization endpoint
- ✅ `routes/authRoutes.js` - Authentication routes
- ✅ `routes/oauthRoutes.js` - OAuth routes
- ✅ `routes/paymentRoutes.js` - Payment routes
- ✅ `routes/userRoutes.js` - User management routes
- ✅ `routes/eventRoutes.js` - Event routes
- ✅ `routes/coachRoutes.js` - Coach routes
- ✅ `routes/bookingPaymentRoutes.js` - Booking payment routes
- ✅ `routes/healthRoutes.js` - Health check route
- ✅ `routes/contactRoutes.js` - Contact form routes

### Middleware Files
- ✅ `middleware/logger.js` - Request logging
- ✅ `middleware/notFound.js` - 404 handler
- ✅ `middleware/errorHandler.js` - Error handler
- ✅ `middleware/auth.js` - Authentication middleware

### Controller Files
- ✅ `controllers/authcontroller.js`
- ✅ `controllers/userController.js`
- ✅ `controllers/adminUserController.js`
- ✅ `controllers/eventController.js`
- ✅ `controllers/coachController.js`
- ✅ `controllers/paymentController.js`
- ✅ `controllers/bookingPaymentController.js`
- ✅ `controllers/contactController.js`
- ✅ `controllers/healthController.js`

### Model Files
- ✅ `models/Event.js`
- ✅ `models/Booking.js`
- ✅ `models/Coach.js`

### Service Files
- ✅ `services/googleCalendar.js`

---

## ✅ Pre-Deployment Verification

### 1. SSL Configuration
- ✅ `config/db.js` has SSL enabled for non-localhost hosts
- ✅ Works with Azure MySQL Flexible Server

### 2. Azure Configuration
- ✅ `.deployment` file exists with `SCM_DO_BUILD_DURING_DEPLOYMENT=true`
- ✅ `startup.sh` exists to ensure dependencies are installed

### 3. Environment Variables Required on Azure
Make sure these are set in Azure App Service → Configuration → Application Settings:

```
DB_HOST=<your-azure-mysql-host>
DB_USER=ajhsportsadmin
DB_PASS=<your-password>
DB_PORT=3306
DB_NAME=ajh_sports
PORT=5001
NODE_ENV=production
JWT_SECRET=<your-jwt-secret>
FRONTEND_URL=https://ajh-sports-308b4.web.app
SESSION_SECRET=<your-session-secret>
```

### 4. Database Setup
After deployment, initialize the database by calling:
```
POST https://ajh-sports-backend.azurewebsites.net/api/setup
```

---

## 🚀 Ready to Deploy!

All necessary files are present and configured correctly. You can now deploy from VS Code:

1. Open `backend` folder in VS Code
2. Azure panel → Right-click `ajh-sports-backend` → Deploy to Web App...
3. Select current workspace
4. Wait for deployment (~2-3 minutes)
5. Test: `POST /api/setup` to initialize database

---

## 📋 Post-Deployment Steps

1. ✅ Call `/api/setup` endpoint to initialize database
2. ✅ Test `/api/health` endpoint
3. ✅ Test `/api/events` endpoint
4. ✅ Verify database connection in logs
5. ✅ Update frontend `VITE_API_URL` to point to Azure backend
