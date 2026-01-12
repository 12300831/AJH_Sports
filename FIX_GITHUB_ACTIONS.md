# 🔧 Fix GitHub Actions Deployment Failures

## Problem

You're getting constant emails about failed deployments because GitHub Actions needs Azure credentials.

## Quick Fix: Stop the Failing Workflow (Temporary)

**Option 1: Disable the workflow temporarily**
1. Go to: https://github.com/12300831/AJH_Sports/actions
2. Click on the workflow: "Deploy Backend to Azure App Service"
3. Click "..." menu → "Disable workflow"
4. This stops the failure emails

**Option 2: Fix the workflow properly (Recommended)**

### Step 1: Get Azure Publish Profile

1. **Azure Portal** → Go to your App Service: `ajh-sports-backend`
2. Click **"Get publish profile"** button (downloads a `.PublishSettings` file)
3. Open the file in Notepad/Text Editor
4. Copy the entire content

### Step 2: Add Secret to GitHub

1. Go to: https://github.com/12300831/AJH_Sports/settings/secrets/actions
2. Click **"New repository secret"**
3. Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
4. Value: Paste the entire content from the publish profile file
5. Click **"Add secret"**

### Step 3: Test Deployment

1. Go to: https://github.com/12300831/AJH_Sports/actions
2. Click "Deploy Backend to Azure App Service"
3. Click "Run workflow" → "Run workflow" (green button)
4. Watch it deploy successfully!

---

## Alternative: Use SQL Fix Instead (No Deployment Needed)

Since GitHub Actions is failing, you can fix the database directly:

1. **Azure Portal** → MySQL server → **Query Editor**
2. Run:
```sql
ALTER TABLE events MODIFY COLUMN image_url TEXT NULL;
ALTER TABLE events MODIFY COLUMN hero_image_url TEXT NULL;
```

This fixes the issue immediately without needing to deploy code!

---

## After Fixing GitHub Actions

Once GitHub Actions is working:
- Code changes will auto-deploy when you push to GitHub
- The permanent fix in `Event.js` will automatically convert VARCHAR → TEXT
- You won't need manual SQL fixes anymore
