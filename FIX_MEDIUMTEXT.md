# 🔧 Fix: Change TEXT to MEDIUMTEXT

## Problem

Even though we changed columns to TEXT, we're still getting:
```
Error: Data too long for column 'image_url' at row 1
```

**Why?** TEXT type in MySQL can only hold up to **65,535 bytes (65KB)**. Base64-encoded images are often larger than this!

## Solution: Use MEDIUMTEXT Instead

**MEDIUMTEXT** can hold up to **16MB** (perfect for base64 images)
**LONGTEXT** can hold up to **4GB** (overkill but works)

---

## Step 1: Run SQL in MySQL

In your MySQL session (still connected in Cloud Shell), run:

```sql
ALTER TABLE events MODIFY COLUMN image_url MEDIUMTEXT NULL;
```

```sql
ALTER TABLE events MODIFY COLUMN hero_image_url MEDIUMTEXT NULL;
```

---

## Step 2: Verify

Run this to check:

```sql
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'ajh_sports' 
  AND TABLE_NAME = 'events' 
  AND COLUMN_NAME IN ('image_url', 'hero_image_url');
```

**Expected:**
- `DATA_TYPE` should be `mediumtext`
- `CHARACTER_MAXIMUM_LENGTH` should be `16777215` (16MB)

---

## Step 3: Test

Try creating an event with image upload again - it should work now! ✅

---

## MySQL TEXT Types Reference

| Type | Max Size |
|------|----------|
| TEXT | 65KB (65,535 bytes) |
| MEDIUMTEXT | 16MB (16,777,215 bytes) |
| LONGTEXT | 4GB (4,294,967,295 bytes) |

For base64 images, **MEDIUMTEXT** is usually sufficient!
