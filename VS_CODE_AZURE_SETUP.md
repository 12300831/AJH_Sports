# 🚀 VS Code Azure Setup Guide

Since you're already logged into Azure in VS Code, here's the **exact step-by-step** to create the App Service:

---

## Step 1: Open Backend Folder in VS Code

1. In VS Code: **File → Open Folder…**
2. Navigate to: `C:\Users\xRytz\AJH_Sports\backend`
3. Click **Select Folder**
4. ✅ You should see `package.json` and `server.js` in the Explorer

---

## Step 2: Create App Service from VS Code

1. **Click the Azure icon** on the left sidebar (blue "A" logo)
2. Under **App Service**, you should see your subscription
3. **Right-click on "App Service"** → **Create New Web App… (Advanced)**
4. Follow the prompts:

   **Subscription:** Select your student subscription  
   **Name:** `ajh-sports-backend` (or try `ajh-sports-backend-2024` if taken)  
   **Runtime stack:** Select **Node 20 LTS**  
   **Operating System:** Select **Linux**  
   **Region:** Select **Australia East** (same as MySQL)  
   **App Service Plan:** Click **Create new** → Name: `ajh-sports-plan` → **B1 Basic** tier → **OK**

5. Wait for creation (~1-2 minutes)
6. ✅ You should see `ajh-sports-backend` appear under **App Service**

---

## Step 3: Configure Environment Variables

### Option A: Using VS Code (Easier)

1. In VS Code Azure panel, **right-click** `ajh-sports-backend`
2. Click **Open in Portal** (opens Azure Portal in browser)
3. In Azure Portal, go to **Configuration** → **Application settings**
4. Click **+ New application setting** and add these **one by one**:

   | Name | Value |
   |------|-------|
   | `DB_HOST` | `ajh-sports-mysql.mysql.database.azure.com` |
   | `DB_PORT` | `3306` |
   | `DB_USER` | `ajhsportsadmin@ajh-sports-mysql` |
   | `DB_PASS` | **[Your MySQL password]** |
   | `DB_NAME` | `ajh_sports` |
   | `PORT` | `5001` |
   | `NODE_ENV` | `production` |
   | `JWT_SECRET` | `ajh_sports_jwt_secret_123456789` (any long random string) |
   | `SESSION_SECRET` | `ajh_sports_session_secret_987654321` (any long random string) |
   | `FRONTEND_URL` | `https://ajh-sports-308b4.web.app` |

5. Click **Save** → **Continue** → App will restart

### Option B: Using PowerShell Script

If you prefer, I can run the PowerShell script that does this automatically. Just tell me your **MySQL password** and I'll configure everything.

---

## Step 4: Deploy Backend Code

1. In VS Code, make sure **backend folder** is open
2. In Azure panel, **right-click** `ajh-sports-backend`
3. Click **Deploy to Web App…**
4. When asked for folder, select **current workspace** (backend folder)
5. Confirm overwrite if asked
6. Wait for deployment (~2-3 minutes)
7. ✅ VS Code will show "Deployment successful"

---

## Step 5: Test Backend

Open in browser:
```
https://ajh-sports-backend.azurewebsites.net/api/health
```

**Expected:** JSON response like `{"status": "ok", ...}`

**If error:** Check **App Service → Log stream** in Azure Portal for error messages.

---

## 🎯 Quick Summary

1. ✅ Open `backend` folder in VS Code
2. ✅ Azure panel → Right-click App Service → Create New Web App
3. ✅ Configure environment variables (Portal or script)
4. ✅ Deploy code from VS Code
5. ✅ Test `/api/health`

---

**Tell me when you've completed Step 2 (App Service created), and I'll help you configure the environment variables!**
