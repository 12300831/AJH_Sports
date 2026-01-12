# 🔧 Fix: Missing `specialty` Column in Coaches Table

## Problem

Error: `Unknown column 'c.specialty' in 'field list'`

The `coaches` table was created with `specialization` column, but the code expects `specialty`.

## Fix Applied

I've updated `backend/routes/setupRoutes.js` to:
1. Add `specialty` column to the coaches table
2. Add `availability` column (also needed by Coach model)
3. Keep `specialization` for backward compatibility

## Next Step: Redeploy Backend

The fix is ready, but needs to be deployed to Azure:

1. **Open VS Code**
2. **File → Open Folder** → Select `backend` folder
3. **Azure Panel** → Right-click `ajh-sports-backend` → **Deploy to Web App...**
4. Select **Current workspace**
5. Wait for deployment (~2-3 minutes)

## After Deployment

The setup route will automatically add the missing columns when you call it again, OR you can manually add them via Azure Portal Query Editor:

```sql
ALTER TABLE coaches ADD COLUMN specialty VARCHAR(255);
ALTER TABLE coaches ADD COLUMN availability TEXT;
```

Then the admin dashboard should work without errors!
