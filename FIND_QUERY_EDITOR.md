# 🔍 How to Find Query Editor in Azure Portal

You're currently on the **Overview** page. Here's how to find Query Editor:

## 📍 Step-by-Step

### Method 1: In the Left Sidebar

1. **Look at the LEFT SIDEBAR** (where you see "Overview" highlighted in blue)

2. **Scroll down** in the left sidebar menu

3. **Look for one of these sections:**
   - **"Settings"** → Click to expand → Look for "Query editor"
   - **"Development tools"** → Click to expand → Look for "Query editor"
   - **"Tools"** → Click to expand → Look for "Query editor"
   - **"Data management"** → Click to expand → Look for "Query editor"

### Method 2: Use the Search Box

1. **In the LEFT SIDEBAR**, look for a search box (small search icon)
2. **Type:** `query editor`
3. **Click** on "Query editor" when it appears in results

### Method 3: Try These Locations

Common locations where Query Editor appears:

1. **Settings** → **Query editor**
2. **Development tools** → **Query editor**
3. **Tools** → **Query editor**
4. Sometimes directly visible as "Query editor" in the menu

### Method 4: If You Still Can't Find It

**Alternative: Use Azure Cloud Shell**

1. Click the **Cloud Shell icon** (looks like `>_` at the top right of Azure Portal)
2. Choose **Bash** or **PowerShell**
3. Connect to MySQL using:
   ```bash
   mysql -h ajh-sports-mysql.mysql.database.azure.com -u ajhsportsadmin -p
   ```
4. Enter password when prompted: `Team404ajhsports`
5. Select database: `USE ajh_sports;`
6. Run your SQL commands

---

## ✅ What Query Editor Looks Like

When you find it and click, you should see:
- A login form (username/password fields)
- Or a query text box where you can type SQL
- A "Run" button (usually green)

---

## 🎯 Important Note About Cloud Shell

**Question:** Is Azure Cloud Shell temporary?

**Answer:**
- ✅ **The Cloud Shell SESSION is temporary** (closes when you close browser)
- ✅ **BUT the SQL changes are PERMANENT!**
- ✅ **ALTER TABLE commands modify your database forever**
- ✅ **Changes stay even after Cloud Shell closes**

**So:** Running SQL in Cloud Shell is perfectly fine - your database will be permanently fixed, even though the session closes!

---

## 🎯 Quick Tip

If Query Editor is not available in your subscription/region, use **Azure Cloud Shell** (Method 4) instead - it works from anywhere! The database changes are permanent regardless of which method you use.
