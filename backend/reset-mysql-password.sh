#!/bin/bash

# Reset MySQL root password to admin123
# This script will:
# 1. Stop MySQL
# 2. Start MySQL in safe mode (skip grant tables)
# 3. Change the password
# 4. Restart MySQL normally

PASSWORD="admin123"
MYSQL_USER="root"

echo "🔐 Resetting MySQL root password to: $PASSWORD"
echo ""

# Step 1: Stop MySQL
echo "Step 1: Stopping MySQL..."
brew services stop mysql
sleep 2

# Step 2: Start MySQL in safe mode (skip grant tables)
echo "Step 2: Starting MySQL in safe mode..."
mysqld_safe --skip-grant-tables --skip-networking > /dev/null 2>&1 &
MYSQL_SAFE_PID=$!
sleep 3

# Step 3: Change password
echo "Step 3: Changing MySQL password..."
mysql -u root <<EOF
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY '$PASSWORD';
FLUSH PRIVILEGES;
EOF

if [ $? -eq 0 ]; then
    echo "✅ Password changed successfully"
else
    echo "❌ Failed to change password"
    # Kill safe mode MySQL
    kill $MYSQL_SAFE_PID 2>/dev/null
    exit 1
fi

# Step 4: Stop safe mode MySQL
echo "Step 4: Stopping safe mode MySQL..."
kill $MYSQL_SAFE_PID 2>/dev/null
sleep 2

# Step 5: Start MySQL normally
echo "Step 5: Starting MySQL normally..."
brew services start mysql
sleep 3

# Step 6: Test connection
echo "Step 6: Testing connection..."
mysql -u root -p"$PASSWORD" -e "SELECT 'Connection successful!' AS Status;" 2>&1

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ MySQL password reset successful!"
    echo "✅ Password is now: $PASSWORD"
    echo "✅ This matches your .env file"
    echo ""
    echo "💡 Next steps:"
    echo "   1. Test connection: node database/test-db-connection.js"
    echo "   2. Restart backend: npm restart"
else
    echo ""
    echo "⚠️  Password may have been set, but connection test failed"
    echo "💡 Try testing manually: mysql -u root -p$PASSWORD"
fi

