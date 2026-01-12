# 🔧 Quick Fix: Add Missing Columns

## Run This SQL in Azure Portal Query Editor

1. **Azure Portal** → MySQL server → **Query editor**
2. **Login** with your MySQL credentials
3. **Select database:** `ajh_sports`
4. **Run these SQL commands:**

```sql
-- Add missing columns to coaches table
ALTER TABLE coaches ADD COLUMN specialty VARCHAR(255);
ALTER TABLE coaches ADD COLUMN availability TEXT;
```

This will fix the 500 error immediately!

---

## For User Visibility Issue

The admin portal uses pagination. Check:
1. **Page number** - Are you on page 1?
2. **Filters** - Any search/filter applied?
3. **Sort order** - Try changing sort options

The user should appear if:
- It was created successfully
- No filters are hiding it
- You're on the correct page
