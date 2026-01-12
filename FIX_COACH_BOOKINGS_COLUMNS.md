# ✅ Fix: Coach Bookings Column Names

## Problem
The `coach_bookings` table uses columns `booking_date` and `booking_time`, but the query in `Booking.js` was trying to access `cb.date` and `cb.time`, causing:

```
Error: Unknown column 'cb.date' in 'field list'
```

## Fix Applied
Updated `backend/models/Booking.js` to use the correct column names:
- Changed `cb.date` → `cb.booking_date`
- Changed `cb.time` → `cb.booking_time`

## Status
✅ Code fixed and pushed to GitHub
⚠️ **Needs deployment to Azure**

## Next Step
Deploy the backend via VS Code to apply the fix:

1. **Open VS Code**
2. **File → Open Folder** → `C:\Users\xRytz\AJH_Sports\backend`
3. **Azure Panel** → App Service → `ajh-sports-backend`
4. **Right-click** → **Deploy to Web App...**
5. Wait ~2-3 minutes

After deployment, the admin portal should load coach bookings without errors!
