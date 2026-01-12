# ✅ Fix Event Image Columns - SQL Instructions

## Quick Fix (5 minutes)

### Step 1: Go to Azure Portal
1. Open: https://portal.azure.com
2. Sign in if needed

### Step 2: Find Your MySQL Server
1. In the search bar at the top, type: **ajh-sports-mysql**
2. Click on your **MySQL Flexible Server** (should show as "ajh-sports-mysql")

### Step 3: Open Query Editor
1. In the left sidebar, look for **"Query editor"** (under "Settings" or "Data management")
2. Click on **"Query editor"**

### Step 4: Connect to Database
1. You'll see a login form
2. Enter:
   - **Username:** `ajhsportsadmin`
   - **Password:** `Team404ajhsports`
3. Click **"OK"** or **"Connect"**

### Step 5: Select Database
1. You might see a dropdown to select database
2. Select: **`ajh_sports`**
3. If you don't see it, it should already be selected

### Step 6: Run First SQL Command
1. In the query editor (big text box), **paste this SQL**:

```sql
ALTER TABLE events MODIFY COLUMN image_url TEXT NULL;
```

2. Click the **"Run"** button (usually green, at the top)
3. Wait for it to complete (should say "Query succeeded" or show "0 rows affected")

### Step 7: Run Second SQL Command
1. **Clear the query box** (or select the text)
2. **Paste this SQL**:

```sql
ALTER TABLE events MODIFY COLUMN hero_image_url TEXT NULL;
```

3. Click **"Run"** button again
4. Wait for it to complete

### Step 8: Verify (Optional)
Run this SQL to check if it worked:

```sql
SELECT COLUMN_NAME, DATA_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'ajh_sports' 
  AND TABLE_NAME = 'events' 
  AND COLUMN_NAME IN ('image_url', 'hero_image_url');
```

**Expected Result:**
- Both columns should show `DATA_TYPE = 'text'` (not `varchar`)

---

## ✅ Done!

Now try creating an event in your admin panel:
1. Go to: https://ajh-sports-308b4.web.app/admin/events
2. Click "Create Event" or edit an existing event
3. Upload images using the drag-and-drop feature
4. It should work now! 🎉

---

## Troubleshooting

**If you can't find Query Editor:**
- Look in left sidebar under different sections
- Try: "Data management" → "Query editor"
- Or use Azure Cloud Shell (top right icon) with MySQL command

**If login fails:**
- Double-check username and password
- Make sure you're using the correct MySQL server

**If SQL gives error:**
- Make sure you're connected to the `ajh_sports` database
- Check if the `events` table exists
- Try running: `USE ajh_sports;` first, then the ALTER commands
