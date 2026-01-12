# 🔧 Fix: Missing Dependencies Error

## Problem
The error shows:
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'express'
```

This means `npm install` wasn't run during deployment.

## ✅ Solution Applied

I've configured Azure App Service to automatically install dependencies:

1. ✅ Created `.deployment` file in backend folder
2. ✅ Set `SCM_DO_BUILD_DURING_DEPLOYMENT=true`
3. ✅ Set `ENABLE_ORYX_BUILD=true`

## 🚀 Next Step: Redeploy

**Please redeploy from VS Code:**

1. **Open VS Code**
2. **Open backend folder** (if not already open)
3. **Azure panel** → Right-click `ajh-sports-backend` → **Deploy to Web App...**
4. **Select current workspace**
5. **Wait for deployment** (~3-5 minutes - it will install dependencies)

## ✅ What Will Happen

During deployment, Azure will:
1. Upload your code
2. **Automatically run `npm install`** (installs all dependencies)
3. Start your app with `npm start`

## 🧪 After Redeployment: Test

Open:
```
https://ajh-sports-backend.azurewebsites.net/api/health
```

You should see a JSON response (not an error)!

---

**Status:** Configuration fixed! Ready for redeployment. 🚀
