# Quick Start Guide

## ✅ Fixed Issues

1. **esbuild Platform Error** - Fixed by reinstalling node_modules
2. **Backend Port** - Configured to run on port 5001
3. **Frontend Port** - Configured to run on port 3000
4. **CORS Configuration** - Backend allows requests from http://localhost:3000

## 🚀 Running the Application

### Start Backend Server

```bash
cd backend
npm start
```

Backend will run on: **http://localhost:5001**

### Start Frontend Server

```bash
cd frontend
npm run dev
```

Frontend will run on: **http://localhost:3000**

## 🔧 Troubleshooting

### If Frontend Fails to Start

If you see esbuild errors, run:

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### If Backend Port is in Use

```bash
cd backend
npm run kill-port
npm start
```

### Check Server Status

```bash
# Check if frontend is running
lsof -ti:3000

# Check if backend is running
lsof -ti:5001
```

## 📝 Environment Setup

### Backend (.env)

Create `backend/.env` with:

```env
PORT=5001
FRONTEND_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
```

### Frontend (.env) - Optional

Create `frontend/.env` with:

```env
VITE_API_URL=http://localhost:5001/api
```

(Defaults are already set in code, so this is optional)

## ✅ Verification

1. **Backend Health Check**: http://localhost:5001/api/health
2. **Frontend**: http://localhost:3000
3. **Test Payment Flow**:
   - Go to Events page
   - Click "Register Now"
   - Fill payment form
   - Should redirect to Stripe checkout

## 🎯 Current Status

- ✅ Frontend: Running on port 3000
- ✅ Backend: Ready to run on port 5001
- ✅ CORS: Configured correctly
- ✅ API Connection: Frontend → Backend configured
