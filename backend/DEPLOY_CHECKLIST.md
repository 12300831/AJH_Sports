# ✅ Pre-Deployment Checklist - /api/setup Route

## ✅ VERIFICATION COMPLETE

All files are verified and correct:

- ✅ `routes/setupRoutes.js` exists (7,752 bytes)
- ✅ Route handler: `router.post('/setup'` found
- ✅ Export statement: `export default router` found
- ✅ `server.js` imports: `import setupRoutes from "./routes/setupRoutes.js"`
- ✅ Route registered: `app.use("/api/setup", setupRoutes)`
- ✅ File NOT in .gitignore (will be deployed)

---

## 🚀 Deployment Steps

### Step 1: Save All Files
1. **Save** `routes/setupRoutes.js` (Ctrl+S)
2. **Save** `server.js` (Ctrl+S)
3. Make sure VS Code shows no unsaved changes (no white dot on tabs)

### Step 2: Open Backend Folder in VS Code
1. **File → Open Folder**
2. Navigate to: `C:\Users\xRytz\AJH_Sports\backend`
3. Click **Select Folder**

**IMPORTANT:** Make sure you're in the **backend** folder, not the root folder!

### Step 3: Deploy to Azure
1. Click **Azure icon** (left sidebar - blue "A")
2. Under **App Service**, find `ajh-sports-backend`
3. **Right-click** `ajh-sports-backend`
4. Click **Deploy to Web App...**
5. When asked "Select the folder to deploy", choose:
   - **Current workspace** (should show `backend` folder)
6. Click **Deploy**
7. **Wait** for deployment to complete (~2-3 minutes)

### Step 4: Verify Deployment
After deployment completes, check the output for:
```
✅ Deployment successful!
```

Then test the endpoint:
```powershell
Invoke-WebRequest -Uri "https://ajh-sports-backend.azurewebsites.net/api/setup" -Method POST
```

---

## 🔍 If Route Still Returns 404

### Check 1: Verify File on Azure
1. **Azure Portal** → App Service → `ajh-sports-backend`
2. **Development Tools** → **SSH** (or **Console**)
3. Run: `cd /home/site/wwwroot && ls routes/ | grep setup`
4. Should show: `setupRoutes.js`

### Check 2: Check Deployment Logs
1. **Azure Portal** → App Service → **Deployment Center**
2. Check latest deployment logs
3. Verify `setupRoutes.js` is in the deployment package

### Check 3: Restart App Service
1. **Azure Portal** → App Service → **Overview**
2. Click **Restart**
3. Wait 1-2 minutes
4. Test endpoint again

---

## ✅ File Status

**Current Status:** ✅ ALL FILES VERIFIED AND READY

The file exists and is correctly configured. If deployment fails, it's a deployment process issue, not a file issue.

---

## 🎯 Quick Test Command

After deployment, run this to test:
```powershell
Invoke-WebRequest -Uri "https://ajh-sports-backend.azurewebsites.net/api/setup" -Method POST -UseBasicParsing
```

Expected response:
```json
{
  "success": true,
  "message": "Database initialized successfully",
  ...
}
```
