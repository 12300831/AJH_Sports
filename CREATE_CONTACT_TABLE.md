# Create Contact Messages Table

## Quick Setup (Choose One Method)

### Method 1: Using MySQL Command Line (Easiest)

1. Open Terminal
2. Run this command (it will prompt for your MySQL password):

```bash
cd "/Users/purnimakc/Desktop/Ajh Sports/AJH_Sports/backend/database"
mysql -u root -p ajh_sports < schema-contact.sql
```

Enter your MySQL root password when prompted.

### Method 2: Using MySQL Client

1. Connect to MySQL:
   ```bash
   mysql -u root -p
   ```

2. Enter your MySQL password

3. Select the database:
   ```sql
   USE ajh_sports;
   ```

4. Copy and paste this SQL:

```sql
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_email (email)
);
```

5. Verify it was created:
   ```sql
   SHOW TABLES LIKE 'contact_messages';
   DESCRIBE contact_messages;
   ```

### Method 3: If You Need to Add Password to .env

If your `.env` file doesn't have the database password:

1. Edit the `.env` file in the `backend` folder:
   ```bash
   cd backend
   nano .env
   # or open in your text editor
   ```

2. Add or update these lines:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_actual_mysql_password_here
   DB_NAME=ajh_sports
   ```

3. Save the file

4. Then run:
   ```bash
   node database/setup-contact-simple.js
   ```

## After Creating the Table

1. Restart your backend server (if it's running):
   ```bash
   cd backend
   # Stop with Ctrl+C if running, then:
   npm start
   ```

2. Test the contact form on your website - it should work now!

## Verify It Works

Test with curl:
```bash
curl -X POST http://localhost:5001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"test message"}'
```

You should see:
```json
{"message":"Thank you for your message! We'll get back to you within 24 hours.","id":1}
```


