#!/bin/bash

# Set MySQL root password to ajhsports2024
PASSWORD="ajhsports2024"

echo "🔐 Setting MySQL root password to: $PASSWORD"
echo ""

# Method 1: Try with sudo mysql
echo "Attempting to set password using sudo mysql..."
sudo mysql <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED BY '$PASSWORD';
FLUSH PRIVILEGES;
SELECT 'Password set successfully!' AS Status;
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ MySQL password set successfully!"
    echo "✅ Password: $PASSWORD"
    echo "✅ This matches your .env file"
    exit 0
fi

echo ""
echo "⚠️  Sudo method failed, trying alternative method..."
echo ""

# Method 2: Stop MySQL, start in safe mode, change password, restart
echo "Step 1: Stopping MySQL..."
brew services stop mysql
sleep 2

echo "Step 2: Starting MySQL in safe mode..."
mysqld_safe --skip-grant-tables --skip-networking > /dev/null 2>&1 &
MYSQL_SAFE_PID=$!
sleep 3

echo "Step 3: Changing MySQL password..."
mysql -u root <<EOF
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY '$PASSWORD';
FLUSH PRIVILEGES;
EOF

if [ $? -eq 0 ]; then
    echo "✅ Password changed in safe mode"
    
    # Stop safe mode MySQL
    echo "Step 4: Stopping safe mode MySQL..."
    kill $MYSQL_SAFE_PID 2>/dev/null
    sleep 2
    
    # Start MySQL normally
    echo "Step 5: Starting MySQL normally..."
    brew services start mysql
    sleep 3
    
    # Test connection
    echo "Step 6: Testing connection..."
    mysql -u root -p"$PASSWORD" -e "SELECT 'Connection successful!' AS Status;" 2>&1
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ MySQL password set successfully!"
        echo "✅ Password: $PASSWORD"
        echo "✅ This matches your .env file"
    else
        echo ""
        echo "⚠️  Password may have been set, but connection test failed"
    fi
else
    echo "❌ Failed to change password in safe mode"
    kill $MYSQL_SAFE_PID 2>/dev/null
    brew services start mysql
    exit 1
fi

