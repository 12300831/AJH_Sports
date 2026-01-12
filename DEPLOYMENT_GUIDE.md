# 🚀 AJH Sports Deployment Guide

Complete step-by-step guide to deploy your application to:
- **Backend**: Azure App Service
- **Frontend**: Firebase Hosting  
- **Database**: Azure MySQL (Flexible Server)

---

## 📋 Prerequisites

- ✅ Azure account with student subscription
- ✅ Firebase account with project created
- ✅ GitHub repository: `https://github.com/12300831/AJH_Sports.git`
- ✅ Node.js 20.x installed locally
- ✅ Azure CLI installed (`az --version`)
- ✅ Firebase CLI installed (`firebase --version`)

---

## Part 1: Azure Setup (Backend + Database)

### Step 1.1: Install Azure CLI (if not installed)

**Windows (PowerShell):**
```powershell
# Download and install from: https://aka.ms/installazurecliwindows
# Or use winget:
winget install -e --id Microsoft.AzureCLI
```

**Verify installation:**
```powershell
az --version
```

### Step 1.2: Login to Azure

```powershell
az login
```

This will open a browser window. Sign in with your Azure account.

### Step 1.3: Create Resource Group

```powershell
az group create --name ajh-sports-rg --location eastus
```

**Note:** Replace `eastus` with your preferred region:
- `eastus` (US East)
- `westeurope` (West Europe)
- `southeastasia` (Southeast Asia)

### Step 1.4: Create Azure MySQL Flexible Server

```powershell
az mysql flexible-server create `
  --resource-group ajh-sports-rg `
  --name ajh-sports-mysql `
  --location eastus `
  --admin-user ajhsportsadmin `
  --admin-password "YourSecurePassword123!" `
  --sku-name Standard_B1ms `
  --tier Burstable `
  --public-access 0.0.0.0 `
  --storage-size 32 `
  --version 8.0.21
```

**Important:** 
- Replace `YourSecurePassword123!` with a strong password (save it!)
- The `--public-access 0.0.0.0` allows connections from anywhere (you can restrict later)

**Get connection details:**
```powershell
az mysql flexible-server show `
  --resource-group ajh-sports-rg `
  --name ajh-sports-mysql `
  --query "{host:fullyQualifiedDomainName, port:network.publicNetworkAccess}" `
  --output table
```

**Note the FQDN** (e.g., `ajh-sports-mysql.mysql.database.azure.com`)

### Step 1.5: Configure MySQL Firewall Rules

Allow Azure services and your IP:

```powershell
# Allow Azure services
az mysql flexible-server firewall-rule create `
  --resource-group ajh-sports-rg `
  --name ajh-sports-mysql `
  --rule-name AllowAzureServices `
  --start-ip-address 0.0.0.0 `
  --end-ip-address 0.0.0.0

# Allow your current IP (replace with your actual IP)
az mysql flexible-server firewall-rule create `
  --resource-group ajh-sports-rg `
  --name ajh-sports-mysql `
  --rule-name AllowMyIP `
  --start-ip-address YOUR_IP_ADDRESS `
  --end-ip-address YOUR_IP_ADDRESS
```

**Find your IP:**
```powershell
# Windows PowerShell
(Invoke-WebRequest -Uri "https://api.ipify.org").Content
```

### Step 1.6: Create Database

```powershell
az mysql flexible-server db create `
  --resource-group ajh-sports-rg `
  --server-name ajh-sports-mysql `
  --database-name ajh_sports
```

### Step 1.7: Create Azure App Service Plan

```powershell
az appservice plan create `
  --name ajh-sports-plan `
  --resource-group ajh-sports-rg `
  --location eastus `
  --sku B1 `
  --is-linux
```

**Note:** `B1` is the Basic tier (suitable for student subscription). For production, consider `S1` or higher.

### Step 1.8: Create Azure App Service (Backend)

```powershell
az webapp create `
  --resource-group ajh-sports-rg `
  --plan ajh-sports-plan `
  --name ajh-sports-backend `
  --runtime "NODE:20-lts"
```

**Note:** Replace `ajh-sports-backend` with your preferred name (must be globally unique).

### Step 1.9: Configure App Service Settings

**Set Node.js version and startup command:**
```powershell
az webapp config appsettings set `
  --resource-group ajh-sports-rg `
  --name ajh-sports-backend `
  --settings `
    WEBSITE_NODE_DEFAULT_VERSION="20-lts" `
    SCM_DO_BUILD_DURING_DEPLOYMENT=true `
    ENABLE_ORYX_BUILD=true
```

**Set startup command:**
```powershell
az webapp config set `
  --resource-group ajh-sports-rg `
  --name ajh-sports-backend `
  --startup-file "npm start"
```

### Step 1.10: Configure Environment Variables in Azure

```powershell
az webapp config appsettings set `
  --resource-group ajh-sports-rg `
  --name ajh-sports-backend `
  --settings `
    NODE_ENV="production" `
    PORT="5001" `
    DB_HOST="ajh-sports-mysql.mysql.database.azure.com" `
    DB_PORT="3306" `
    DB_USER="ajhsportsadmin" `
    DB_PASS="YourSecurePassword123!" `
    DB_NAME="ajh_sports" `
    JWT_SECRET="$(openssl rand -base64 32)" `
    SESSION_SECRET="$(openssl rand -base64 32)" `
    FRONTEND_URL="https://your-firebase-app.web.app" `
    STRIPE_SECRET_KEY="your-stripe-secret-key" `
    STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret" `
    GOOGLE_CLIENT_ID="your-google-client-id" `
    GOOGLE_CLIENT_SECRET="your-google-client-secret" `
    FACEBOOK_APP_ID="your-facebook-app-id" `
    FACEBOOK_APP_SECRET="your-facebook-app-secret"
```

**Important:** 
- Replace all placeholder values with your actual credentials
- For `JWT_SECRET` and `SESSION_SECRET`, generate random strings:
  ```powershell
  # PowerShell
  [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))
  ```

### Step 1.11: Get Azure Publish Profile

**Download publish profile:**
```powershell
az webapp deployment list-publishing-profiles `
  --resource-group ajh-sports-rg `
  --name ajh-sports-backend `
  --xml > azure-publish-profile.xml
```

**Copy the contents** of `azure-publish-profile.xml` - you'll need this for GitHub Secrets.

---

## Part 2: Firebase Setup (Frontend)

### Step 2.1: Install Firebase CLI (if not installed)

```powershell
npm install -g firebase-tools
```

### Step 2.2: Login to Firebase

```powershell
firebase login
```

### Step 2.3: Initialize Firebase in Project

```powershell
cd frontend
firebase init hosting
```

**Select options:**
- ✅ Use an existing project: Select your Firebase project
- ✅ Public directory: `build` (matches your Vite config)
- ✅ Configure as single-page app: **Yes**
- ✅ Set up automatic builds: **No** (we'll use GitHub Actions)
- ✅ Overwrite index.html: **No**

### Step 2.4: Update `.firebaserc`

Edit `.firebaserc` in the root directory:
```json
{
  "projects": {
    "default": "your-actual-firebase-project-id"
  }
}
```

### Step 2.5: Get Firebase Service Account

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **⚙️ Settings** → **Project settings**
4. Go to **Service accounts** tab
5. Click **Generate new private key**
6. Save the JSON file securely

**You'll need this JSON content for GitHub Secrets.**

---

## Part 3: GitHub Secrets Configuration

### Step 3.1: Add Azure Secrets

1. Go to: `https://github.com/12300831/AJH_Sports/settings/secrets/actions`
2. Click **New repository secret**
3. Add these secrets:

| Secret Name | Value | Source |
|------------|-------|--------|
| `AZURE_WEBAPP_PUBLISH_PROFILE` | Contents of `azure-publish-profile.xml` | Step 1.11 |
| `AZURE_WEBAPP_NAME` | `ajh-sports-backend` | Your App Service name |

### Step 3.2: Add Firebase Secrets

| Secret Name | Value | Source |
|------------|-------|--------|
| `FIREBASE_SERVICE_ACCOUNT` | Entire JSON content from Step 2.5 | Firebase Console |
| `FIREBASE_PROJECT_ID` | Your Firebase project ID | Firebase Console |
| `VITE_API_URL` | `https://ajh-sports-backend.azurewebsites.net/api` | Your Azure backend URL |

---

## Part 4: Database Migration

### Step 4.1: Update Local `.env` Temporarily

Update `backend/.env` with Azure MySQL credentials:

```env
DB_HOST=ajh-sports-mysql.mysql.database.azure.com
DB_PORT=3306
DB_USER=ajhsportsadmin
DB_PASS=YourSecurePassword123!
DB_NAME=ajh_sports
```

### Step 4.2: Run Database Setup Scripts

```powershell
cd backend
npm install
npm run db:setup-extended
npm run db:create-admin
```

**Note:** You may need to install MySQL client locally or use Azure Cloud Shell.

### Step 4.3: Seed Initial Data (Optional)

```powershell
node database/seed-events.js
```

---

## Part 5: Update Frontend API URL

### Step 5.1: Check Frontend API Configuration

Find where your frontend makes API calls (likely in `frontend/src/services/` or `frontend/src/config/`).

### Step 5.2: Update API Base URL

The frontend should use `VITE_API_BASE_URL` environment variable. Check if it's configured:

```typescript
// Example: frontend/src/config/api.ts
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
```

**For production build**, GitHub Actions will inject `VITE_API_URL` from secrets.

---

## Part 6: Deploy!

### Step 6.1: Update GitHub Workflow Files

1. Edit `.github/workflows/deploy-backend-azure.yml`
   - Update `AZURE_WEBAPP_NAME` if different from `ajh-sports-backend`

2. Edit `.github/workflows/deploy-frontend-firebase.yml`
   - Verify `FIREBASE_PROJECT_ID` matches your project

### Step 6.2: Commit and Push

```powershell
git add .
git commit -m "Add deployment configuration"
git push origin main
```

### Step 6.3: Trigger Manual Deployment

**Backend:**
1. Go to: `https://github.com/12300831/AJH_Sports/actions`
2. Click **Deploy Backend to Azure App Service**
3. Click **Run workflow** → **Run workflow**

**Frontend:**
1. Click **Deploy Frontend to Firebase Hosting**
2. Click **Run workflow** → **Run workflow**

---

## Part 7: Post-Deployment Verification

### Step 7.1: Test Backend

```powershell
# Check backend health
curl https://ajh-sports-backend.azurewebsites.net/api/health
```

### Step 7.2: Test Frontend

Visit your Firebase Hosting URL:
```
https://your-firebase-project.web.app
```

### Step 7.3: Check Logs

**Azure App Service logs:**
```powershell
az webapp log tail `
  --resource-group ajh-sports-rg `
  --name ajh-sports-backend
```

**Or in Azure Portal:**
1. Go to App Service → **Log stream**

---

## 🔧 Troubleshooting

### Backend Issues

**Problem:** App Service shows "Application Error"
- **Solution:** Check logs, verify environment variables are set correctly

**Problem:** Database connection fails
- **Solution:** 
  - Verify firewall rules allow Azure services
  - Check DB credentials in App Service settings
  - Ensure MySQL server is running

**Problem:** Port binding error
- **Solution:** Azure App Service uses `PORT` env var automatically. Ensure your code uses `process.env.PORT`

### Frontend Issues

**Problem:** API calls fail (CORS)
- **Solution:** Update `FRONTEND_URL` in Azure App Service settings to your Firebase URL

**Problem:** Build fails in GitHub Actions
- **Solution:** Check `VITE_API_URL` secret is set correctly

### Database Issues

**Problem:** Can't connect from local machine
- **Solution:** Add your IP to firewall rules (Step 1.5)

---

## 📝 Environment Variables Reference

### Backend (Azure App Service)

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `5001` |
| `DB_HOST` | MySQL hostname | `ajh-sports-mysql.mysql.database.azure.com` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_USER` | MySQL username | `ajhsportsadmin` |
| `DB_PASS` | MySQL password | `YourSecurePassword123!` |
| `DB_NAME` | Database name | `ajh_sports` |
| `JWT_SECRET` | JWT signing secret | Random base64 string |
| `SESSION_SECRET` | Session secret | Random base64 string |
| `FRONTEND_URL` | Frontend URL | `https://your-app.web.app` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | `whsec_...` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | `xxx` |
| `FACEBOOK_APP_ID` | Facebook app ID | `123456789` |
| `FACEBOOK_APP_SECRET` | Facebook app secret | `xxx` |

### Frontend (Build-time)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://ajh-sports-backend.azurewebsites.net/api` |

---

## 🎯 Next Steps

1. ✅ Set up custom domain (optional)
2. ✅ Configure SSL certificates (automatic with Azure/Firebase)
3. ✅ Set up monitoring and alerts
4. ✅ Configure backup strategy for database
5. ✅ Set up CI/CD for automatic deployments (modify workflows)

---

## 📞 Support

If you encounter issues:
1. Check Azure App Service logs
2. Check GitHub Actions logs
3. Verify all secrets are set correctly
4. Ensure database firewall allows connections

---

**Last Updated:** January 2026
