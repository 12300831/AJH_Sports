# Fix Event Image Columns - Manual SQL

## Quick Fix Instructions

### Option A: Azure Portal (Recommended - No CLI needed)

1. **Go to Azure Portal**: https://portal.azure.com
2. **Navigate to your MySQL server**:
   - Search for "ajh-sports-mysql" in the search bar
   - Click on your MySQL Flexible Server

3. **Open Query Editor**:
   - In the left sidebar, click "Query Editor" (or "Databases" → "Query Editor")
   - If prompted, click "Connect" and use:
     - Username: `ajhsportsadmin`
     - Password: `Team404ajhsports`
   - Select database: `ajh_sports`

4. **Run these SQL commands** (one at a time):
```sql
ALTER TABLE events MODIFY COLUMN image_url TEXT NULL;
```

```sql
ALTER TABLE events MODIFY COLUMN hero_image_url TEXT NULL;
```

5. **Verify**:
```sql
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'ajh_sports' 
  AND TABLE_NAME = 'events' 
  AND COLUMN_NAME IN ('image_url', 'hero_image_url');
```

You should see `DATA_TYPE = 'text'` for both columns.

### Option B: Azure CLI (If you have mysql client)

```bash
# Connect to Azure MySQL
mysql -h ajh-sports-mysql.mysql.database.azure.com \
      -u ajhsportsadmin \
      -pTeam404ajhsports \
      -D ajh_sports \
      --ssl-mode=REQUIRED \
      -e "ALTER TABLE events MODIFY COLUMN image_url TEXT NULL;"

mysql -h ajh-sports-mysql.mysql.database.azure.com \
      -u ajhsportsadmin \
      -pTeam404ajhsports \
      -D ajh_sports \
      --ssl-mode=REQUIRED \
      -e "ALTER TABLE events MODIFY COLUMN hero_image_url TEXT NULL;"
```

### What This Does

- Changes `image_url` from `VARCHAR(1024)` to `TEXT` (can store up to 65KB)
- Changes `hero_image_url` from `VARCHAR(1024)` to `TEXT`
- Allows storing base64-encoded images (which can be very large)

After running these commands, try creating an event again!
