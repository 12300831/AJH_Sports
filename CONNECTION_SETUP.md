# Frontend-Backend Connection Setup

## ✅ Configuration Summary

### Backend Configuration
- **Port**: `5001` (default)
- **Frontend URL**: `http://localhost:3000` (for CORS)
- **API Base URL**: `http://localhost:5001/api`

### Frontend Configuration
- **Port**: `3000` (default)
- **Backend API URL**: `http://localhost:5001/api`

## 📁 Files Updated

### Backend Files
1. **`backend/server.js`**
   - Updated default port from `5000` to `5001`
   - Updated CORS origin from `http://localhost:5173` to `http://localhost:3000`
   - Updated console log messages

2. **`backend/package.json`**
   - Updated `kill-port` script to use port `5001`

3. **`backend/kill-port.sh`**
   - Updated default port from `5000` to `5001`

4. **`backend/.env.example`** (created)
   - Contains all environment variables with correct defaults

### Frontend Files
1. **`frontend/src/services/paymentService.ts`**
   - Updated default API URL from `http://localhost:5000/api` to `http://localhost:5001/api`

2. **`frontend/.env.example`** (created)
   - Contains `VITE_API_URL=http://localhost:5001/api`

## 🚀 Setup Instructions

### 1. Backend Setup

```bash
cd backend

# Create .env file from example
cp .env.example .env

# Edit .env and add your actual values:
# - STRIPE_SECRET_KEY (get from Stripe Dashboard)
# - STRIPE_WEBHOOK_SECRET (get from Stripe Dashboard)
# - Database credentials (if using MySQL)
# - JWT_SECRET (generate a random string)

# Install dependencies (if not already done)
npm install

# Start the server
npm start
```

The backend will run on `http://localhost:5001`

### 2. Frontend Setup

```bash
cd frontend

# Create .env file from example (optional - defaults are already set)
cp .env.example .env

# Install dependencies (if not already done)
npm install

# Start the frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🔗 API Endpoints

### Payment Endpoints
- **POST** `/api/payments/create-checkout-session` - Create Stripe checkout session
- **GET** `/api/payments/session/:sessionId` - Get checkout session details
- **POST** `/api/payments/webhook` - Stripe webhook endpoint

### Auth Endpoints
- **POST** `/api/auth/signup` - User registration
- **POST** `/api/auth/login` - User login

### Health Check
- **GET** `/api/health` - Server health check

## ✅ Verification

### Test Backend Connection

1. **Health Check**:
   ```bash
   curl http://localhost:5001/api/health
   ```
   Should return: `{"status":"ok","message":"Server is running",...}`

2. **Check CORS**:
   - Open browser console on `http://localhost:3000`
   - Make a payment request
   - Should not see CORS errors

### Test Frontend-Backend Connection

1. Start both servers:
   ```bash
   # Terminal 1 - Backend
   cd backend && npm start
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

2. Navigate to `http://localhost:3000`
3. Go to Events page and click "Register Now"
4. Fill out payment form and submit
5. Should redirect to Stripe checkout

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5001
npm run kill-port

# Or manually
lsof -ti:5001 | xargs kill -9
```

### CORS Errors
- Make sure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check that backend CORS is configured correctly in `server.js`

### API Connection Failed
- Verify backend is running: `curl http://localhost:5001/api/health`
- Check browser console for errors
- Verify `VITE_API_URL` in frontend `.env` matches backend URL

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5001/api
```

## 🎯 Next Steps

1. ✅ Backend and frontend are configured to connect
2. ⏳ Add your Stripe API keys to backend `.env`
3. ⏳ Test the payment flow end-to-end
4. ⏳ Set up webhook endpoint (requires ngrok or similar for local testing)

