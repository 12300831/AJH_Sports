# 🌱 Seed Events & Coaches Data

## Problem
After deployment, your events and coaches data are missing from the database.

## Solution
I've created API endpoints to seed the data. You have 3 options:

---

## Option 1: Seed Everything (Recommended) ⚡

**One command to seed both events and coaches:**

```powershell
Invoke-WebRequest -Uri "https://ajh-sports-backend.azurewebsites.net/api/seed/all" -Method POST -UseBasicParsing
```

This will:
- ✅ Add/update 4 events (Tennis Open, Table Tennis, Kids Sports Party, 1-ON-1 Coaching)
- ✅ Add 4 coaches (Michael Rodriguez, James Wilson, Mark Leo, Kristin Russell)

---

## Option 2: Seed Events Only

```powershell
Invoke-WebRequest -Uri "https://ajh-sports-backend.azurewebsites.net/api/seed/events" -Method POST -UseBasicParsing
```

---

## Option 3: Seed Coaches Only

```powershell
Invoke-WebRequest -Uri "https://ajh-sports-backend.azurewebsites.net/api/seed/coaches" -Method POST -UseBasicParsing
```

---

## What Gets Seeded?

### Events (4 total):
1. **Tennis Open 2025** - Aug 10, 2025 - $30 - 24 spots
2. **Table Tennis Tournament** - Jan 22, 2025 - $35 - 32 spots
3. **Kids Sports Party** - Feb 1, 2025 - $25 - 20 spots
4. **1-ON-1 Coaching** - Dec 31, 2025 - $60 - 100 spots

### Coaches (4 total):
1. **Michael Rodriguez** - Advanced Techniques - $80/hr
2. **James Wilson** - Serve Specialist - $70/hr
3. **Mark Leo** - Junior Development - $60/hr
4. **Kristin Russell** - Junior Development - $60/hr

---

## After Seeding

1. **Refresh your admin portal** - Events and coaches should appear
2. **Check the frontend** - Events page should show all 4 events
3. **Check coaches page** - Should show all 4 coaches

---

## Note

- If events/coaches already exist, they will be **updated** (not duplicated)
- The seed script is **idempotent** - safe to run multiple times
- You need to **redeploy the backend** first (to add the seed routes)
