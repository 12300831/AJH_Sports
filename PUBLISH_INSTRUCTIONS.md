# 🚀 Quick Publish Instructions

Your Firebase project ID is configured: **ajh-sports-308b4**

## ✅ What's Already Done

- ✅ Firebase project ID updated in `.firebaserc`
- ✅ GitHub Actions workflows created
- ✅ Firebase hosting config (`firebase.json`) ready

## 📋 What You Need to Do

### Step 1: Get Firebase Service Account (Required)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **ajh-sports-308b4**
3. Click **⚙️ Settings** → **Project settings**
4. Go to **Service accounts** tab
5. Click **Generate new private key**
6. Save the JSON file (you'll need its contents)

### Step 2: Set GitHub Secrets

Go to: `https://github.com/12300831/AJH_Sports/settings/secrets/actions`

Click **New repository secret** and add:

| Secret Name | Value | How to Get |
|------------|-------|------------|
| `FIREBASE_SERVICE_ACCOUNT` | **Entire JSON content** from Step 1 | Copy/paste the whole JSON file content |
| `VITE_API_URL` | `https://your-backend.azurewebsites.net/api` | Your Azure backend URL (or `http://localhost:5001/api` for testing) |

**Note:** If you haven't set up Azure backend yet, use `http://localhost:5001/api` temporarily. You can update it later.

### Step 3: Commit and Push Changes

```powershell
git add .
git commit -m "Configure Firebase project ID for deployment"
git push origin main
```

### Step 4: Deploy Frontend

1. Go to: `https://github.com/12300831/AJH_Sports/actions`
2. Click **Deploy Frontend to Firebase Hosting**
3. Click **Run workflow** → **Run workflow**

Your frontend will be live at: **https://ajh-sports-308b4.web.app**

---

## ⚠️ Important Notes

### Backend Deployment (Azure)

If you want to deploy the backend too, you need:

1. **Azure App Service** created
2. **Azure MySQL** database set up
3. **Azure Publish Profile** downloaded
4. GitHub Secret: `AZURE_WEBAPP_PUBLISH_PROFILE` (contents of publish profile XML)
5. GitHub Secret: `AZURE_WEBAPP_NAME` (your App Service name)

See `DEPLOYMENT_GUIDE.md` for full Azure setup instructions.

### Frontend API URL

The frontend needs to know where your backend is. Set `VITE_API_URL` secret to:
- **Local testing**: `http://localhost:5001/api`
- **Production**: `https://your-backend.azurewebsites.net/api`

---

## 🎯 Quick Test Deployment

If you just want to test Firebase deployment:

1. ✅ Set `FIREBASE_SERVICE_ACCOUNT` secret (Step 2)
2. ✅ Set `VITE_API_URL` to `http://localhost:5001/api` (temporary)
3. ✅ Push to GitHub
4. ✅ Run the workflow

Your site will be live, but API calls will fail until you set up Azure backend.

---

## 📞 Need Help?

- Full deployment guide: `DEPLOYMENT_GUIDE.md`
- Quick checklist: `DEPLOYMENT_QUICK_START.md`
