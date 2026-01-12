# 🔧 Fix: Frontend "Failed to Fetch" Error

## Problem

The frontend at `https://ajh-sports-308b4.web.app` is trying to connect to `localhost:5001` instead of your Azure backend, causing "failed to fetch" errors.

## Solution

The frontend needs to be rebuilt with the Azure backend URL. I've updated the deployment script to automatically set this.

---

## Quick Fix: Redeploy Frontend

### Option 1: Use Updated Script (Recommended)

I've updated `deploy-firebase.ps1` to automatically use the Azure backend URL. Just run:

```powershell
.\deploy-firebase.ps1
```

This will:
1. Build the frontend with `VITE_API_URL=https://ajh-sports-backend.azurewebsites.net/api`
2. Deploy to Firebase Hosting

### Option 2: Manual Build & Deploy

If you prefer to do it manually:

```powershell
cd frontend

# Set the API URL environment variable
$env:VITE_API_URL = "https://ajh-sports-backend.azurewebsites.net/api"

# Build
npm run build

# Deploy
cd ..
firebase deploy --only hosting --project ajh-sports-308b4
```

---

## Verify After Deployment

After redeploying, test your frontend:

1. **Open:** `https://ajh-sports-308b4.web.app/signin`
2. **Try to sign in** - it should now connect to Azure backend
3. **Check browser console** (F12) - should see API calls to `ajh-sports-backend.azurewebsites.net`

---

## What Changed

- ✅ Updated `deploy-firebase.ps1` to set `VITE_API_URL` before building
- ✅ Created `frontend/.env.production` as backup (Vite will use this automatically)

---

## Note

Vite environment variables are embedded at **build time**, not runtime. That's why you need to rebuild and redeploy the frontend for the change to take effect.
