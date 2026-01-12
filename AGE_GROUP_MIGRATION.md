# Age Group Field Migration

## Summary
Replace Status field in admin form with Age Group field. The Age Group will control the "Who Can Join?" section displayed on event details.

## Changes Needed

### 1. Database
Add `age_group` column to `events` table:
```sql
ALTER TABLE events ADD COLUMN age_group VARCHAR(255) NULL AFTER hero_image_url;
```

### 2. Backend
- Update Event model to include `age_group` in create/update operations
- Update event controller to accept `age_group` instead of `status` (or in addition to)

### 3. Frontend
- ✅ Form: Replace Status dropdown with Age Group input field (DONE)
- ✅ TypeScript: Update Event interface to use `age_group` instead of `status` (DONE)
- Update EventsWrapper.tsx to use `age_group` from backend data for "Who Can Join?" display

## Note
Status field may still be needed in backend for filtering inactive events, but it's removed from the admin form UI.
