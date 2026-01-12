# ✅ Step 2: Seed Data - Status

## What I've Done

1. ✅ **Added seed functionality** to `backend/routes/setupRoutes.js`
   - Seeds 4 events (Tennis Open, Table Tennis, Kids Sports Party, 1-ON-1 Coaching)
   - Seeds 4 coaches (Michael Rodriguez, James Wilson, Mark Leo, Kristin Russell)
   - Committed and pushed to GitHub

2. ✅ **Created seed endpoints** in `backend/routes/migrateRoutes.js`
   - `/api/migrate/seed-events` - Seed events only
   - `/api/migrate/seed-coaches` - Seed coaches only  
   - `/api/migrate/seed-all` - Seed both
   - Committed and pushed to GitHub

## ⚠️ Next Step: Deploy Backend

The code is ready but needs to be deployed to Azure. You have 2 options:

### Option A: Deploy via VS Code (Recommended - Most Reliable)

1. **Open VS Code**
2. **File → Open Folder** → Select `C:\Users\xRytz\AJH_Sports\backend`
3. **Azure Panel** (left sidebar)
4. **App Service** → Find `ajh-sports-backend`
5. **Right-click** → **Deploy to Web App...**
6. Select **Current workspace**
7. Wait ~2-3 minutes for deployment

### Option B: Use the Setup Route (Works if already deployed)

After deployment, call:
```powershell
Invoke-WebRequest -Uri "https://ajh-sports-backend.azurewebsites.net/api/setup" -Method POST -UseBasicParsing
```

This will seed the data automatically.

## After Deployment

Once deployed, you can seed data using:

```powershell
# Seed everything
Invoke-WebRequest -Uri "https://ajh-sports-backend.azurewebsites.net/api/migrate/seed-all" -Method POST -UseBasicParsing

# Or seed separately
Invoke-WebRequest -Uri "https://ajh-sports-backend.azurewebsites.net/api/migrate/seed-events" -Method POST -UseBasicParsing
Invoke-WebRequest -Uri "https://ajh-sports-backend.azurewebsites.net/api/migrate/seed-coaches" -Method POST -UseBasicParsing
```

## What Gets Seeded

### Events (4):
- Tennis Open 2025 - $30 - 24 spots
- Table Tennis Tournament - $35 - 32 spots  
- Kids Sports Party - $25 - 20 spots
- 1-ON-1 Coaching - $60 - 100 spots

### Coaches (4):
- Michael Rodriguez - Advanced Techniques - $80/hr
- James Wilson - Serve Specialist - $70/hr
- Mark Leo - Junior Development - $60/hr
- Kristin Russell - Junior Development - $60/hr

---

**Status**: Code is ready, waiting for deployment! 🚀
