# Add Age Group Column to Database

## SQL Command

Run this SQL in your MySQL session (Cloud Shell):

```sql
ALTER TABLE events ADD COLUMN age_group VARCHAR(255) NULL AFTER hero_image_url;
```

## Verify

After running, verify it was added:

```sql
SELECT COLUMN_NAME, DATA_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'ajh_sports' 
  AND TABLE_NAME = 'events' 
  AND COLUMN_NAME = 'age_group';
```

You should see `age_group` with `DATA_TYPE = 'varchar'`.
