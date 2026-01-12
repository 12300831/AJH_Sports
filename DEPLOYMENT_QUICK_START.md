# 🚀 Deployment Quick Start Checklist

Use this checklist to quickly deploy your app. For detailed instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

## ✅ Pre-Deployment Checklist

- [ ] Azure account with student subscription active
- [ ] Firebase project created
- [ ] GitHub repository: `https://github.com/12300831/AJH_Sports.git`
- [ ] Azure CLI installed (`az --version`)
- [ ] Firebase CLI installed (`firebase --version`)

---

## 📝 Step-by-Step Deployment

### 1️⃣ Azure Setup (Backend + Database)

```powershell
# Login to Azure
az login

# Create resource group
az group create --name ajh-sports-rg --location eastus

# Create MySQL server
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

# Create database
az mysql flexible-server db create `
  --resource-group ajh-sports-rg `
  --server-name ajh-sports-mysql `
  --database-name ajh_sports

# Create App Service Plan
az appservice plan create `
  --name ajh-sports-plan `
  --resource-group ajh-sports-rg `
  --location eastus `
  --sku B1 `
  --is-linux

# Create App Service
az webapp create `
  --resource-group ajh-sports-rg `
  --plan ajh-sports-plan `
  --name ajh-sports-backend `
  --runtime "NODE:20-lts"

# Configure App Service
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
    JWT_SECRET="<generate-random>" `
    SESSION_SECRET="<generate-random>" `
    FRONTEND_URL="https://your-firebase-app.web.app"

# Get publish profile
az webapp deployment list-publishing-profiles `
  --resource-group ajh-sports-rg `
  --name ajh-sports-backend `
  --xml > azure-publish-profile.xml
```

### 2️⃣ Firebase Setup (Frontend)

```powershell
# Login to Firebase
firebase login

# Initialize Firebase (in frontend directory)
cd frontend
firebase init hosting
# Select: existing project, public directory: build, SPA: Yes

# Update .firebaserc with your project ID
```

### 3️⃣ GitHub Secrets

Go to: `https://github.com/12300831/AJH_Sports/settings/secrets/actions`

Add these secrets:

| Secret Name | Value |
|------------|-------|
| `AZURE_WEBAPP_PUBLISH_PROFILE` | Contents of `azure-publish-profile.xml` |
| `AZURE_WEBAPP_NAME` | `ajh-sports-backend` |
| `FIREBASE_SERVICE_ACCOUNT` | JSON from Firebase Console → Settings → Service Accounts |
| `FIREBASE_PROJECT_ID` | Your Firebase project ID |
| `VITE_API_URL` | `https://ajh-sports-backend.azurewebsites.net/api` |

### 4️⃣ Database Migration

```powershell
# Update backend/.env with Azure MySQL credentials
cd backend

# Run setup scripts
npm install
npm run db:setup-extended
npm run db:create-admin
```

### 5️⃣ Deploy!

```powershell
# Commit and push
git add .
git commit -m "Add deployment configuration"
git push origin main

# Trigger deployments manually:
# 1. Go to: https://github.com/12300831/AJH_Sports/actions
# 2. Click "Deploy Backend to Azure App Service" → Run workflow
# 3. Click "Deploy Frontend to Firebase Hosting" → Run workflow
```

---

## 🔍 Verify Deployment

### Backend Health Check
```powershell
curl https://ajh-sports-backend.azurewebsites.net/api/health
```

### Frontend
Visit: `https://your-firebase-project.web.app`

### View Logs
```powershell
# Azure App Service logs
az webapp log tail --resource-group ajh-sports-rg --name ajh-sports-backend
```

---

## ⚠️ Common Issues

**Backend shows "Application Error"**
- Check Azure App Service logs
- Verify all environment variables are set

**Database connection fails**
- Check firewall rules allow Azure services
- Verify DB credentials in App Service settings

**Frontend API calls fail**
- Verify `VITE_API_URL` secret is set correctly
- Check CORS settings in backend (`FRONTEND_URL` env var)

---

## 📚 Full Documentation

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.
