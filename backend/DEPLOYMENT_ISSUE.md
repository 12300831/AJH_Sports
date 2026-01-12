# ⚠️ Deployment Issue: `/api/setup` Route Missing

## Problem

The `/api/setup` route returns 404 even after deployment. This means `setupRoutes.js` wasn't included in the deployment.

## Solution: Force Redeploy

### Step 1: Verify Files Locally

All files are correct:
- ✅ `routes/setupRoutes.js` exists
- ✅ `server.js` imports it correctly
- ✅ Route is registered: `app.use("/api/setup", setupRoutes)`

### Step 2: Redeploy from VS Code

**Important:** Make sure you're deploying the **entire backend folder**, not just individual files.

1. **Open VS Code**
2. **File → Open Folder** → Select `C:\Users\xRytz\AJH_Sports\backend`
3. **Azure Panel** → Right-click `ajh-sports-backend`
4. **Deploy to Web App...**
5. **Select:** Current workspace (backend folder)
6. **Wait** for deployment to complete (~2-3 minutes)

### Step 3: Verify Deployment

After deployment, check the logs for:
```
✅ Backend running on port: 5001
```

Then test:
```powershell
Invoke-WebRequest -Uri "https://ajh-sports-backend.azurewebsites.net/api/setup" -Method POST
```

---

## Alternative: Manual File Check

If redeploying doesn't work, verify the file is in the deployment:

1. **Azure Portal** → App Service → `ajh-sports-backend`
2. **Development Tools** → **SSH** (or **Console**)
3. Navigate to: `cd /home/site/wwwroot`
4. Check: `ls routes/ | grep setup`
5. If missing, the deployment didn't include it

---

## Why This Happens

Azure App Service deployments sometimes skip files if:
- The file wasn't saved before deployment
- The deployment was interrupted
- VS Code didn't sync all files

**Solution:** Always deploy the entire folder, not individual files.
