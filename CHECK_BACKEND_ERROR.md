# 🔍 Check Backend Error Logs

## ✅ Database Fixed!
- Both `image_url` and `hero_image_url` are now `TEXT` type ✓
- Database fix is complete!

## ❌ But Still Getting 500 Error

The database is fixed, but there's another error. We need to see the actual error message from the backend.

---

## Step 1: Check Azure Portal Logs

### Method A: Azure Portal (Easier)

1. **Go to**: https://portal.azure.com
2. **Search for**: `ajh-sports-backend`
3. **Click** on your App Service
4. **Click "Log stream"** (left sidebar, under "Monitoring")
5. **Try creating an event** in your browser (the one giving 500 error)
6. **Watch the logs** - you should see the actual error message appear

Look for lines like:
- `❌ Error creating event`
- `Create event error:`
- `Error details:`
- SQL errors
- Stack traces

### Method B: Azure CLI

```powershell
az webapp log tail --name ajh-sports-backend --resource-group ajh-sports-rg
```

Then try creating an event and watch the logs.

---

## Common Issues After Column Fix

1. **Backend code not deployed** - The date format fix might not be deployed
2. **Other database error** - Different column/table issue
3. **Data validation error** - Something wrong with the data being sent

---

## What to Look For

The logs should show something like:
```
Create event error: [actual error message]
Error details: { message: "...", code: "...", sqlMessage: "..." }
```

**Share the actual error message from the logs** so we can fix it!

---

## Quick Fixes

### If you see date format errors:
- The date format fix needs to be deployed (it's in the code, just needs deployment)

### If you see other SQL errors:
- Share the error message and we'll fix it

### If you see connection errors:
- Check database connection settings
