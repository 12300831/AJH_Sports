#!/bin/bash

# Set MySQL Root Password Script for macOS
# This script sets the MySQL root password to ajhsports2024

PASSWORD="ajhsports2024"

echo "🔐 Setting MySQL Root Password"
echo "=============================="
echo ""
echo "This script will set the MySQL root password to: $PASSWORD"
echo ""

# Check if MySQL command exists in common paths
MYSQL_CMD=""
for path in "/usr/local/bin/mysql" "/opt/homebrew/bin/mysql" "/usr/local/mysql/bin/mysql" "/usr/bin/mysql"; do
    if [ -f "$path" ]; then
        MYSQL_CMD="$path"
        break
    fi
done

# If MySQL not found, try to find it
if [ -z "$MYSQL_CMD" ]; then
    MYSQL_CMD=$(which mysql 2>/dev/null)
fi

if [ -z "$MYSQL_CMD" ]; then
    echo "❌ MySQL command not found!"
    echo "Please make sure MySQL is installed."
    echo ""
    echo "If you installed MySQL via Homebrew, try:"
    echo "  brew services start mysql"
    exit 1
fi

echo "✅ Found MySQL at: $MYSQL_CMD"
echo ""

# Try to connect using sudo mysql (works on macOS if password auth is disabled for root)
echo "🔌 Attempting to connect to MySQL using sudo..."
echo "You may be prompted for your macOS password"
echo ""

# Create a temporary SQL file
SQL_FILE=$(mktemp)
cat > "$SQL_FILE" <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED BY '${PASSWORD}';
FLUSH PRIVILEGES;
SELECT 'Password set successfully!' AS status;
EOF

# Try to execute using sudo mysql
if sudo "$MYSQL_CMD" < "$SQL_FILE" 2>&1; then
    echo ""
    echo "✅ MySQL root password successfully set to: $PASSWORD"
    echo ""
    echo "📋 Verification:"
    echo "   Password: $PASSWORD"
    echo "   This matches your backend/.env file (DB_PASS=$PASSWORD)"
    echo ""
    echo "🎉 Done! You can now start your backend server."
else
    echo ""
    echo "⚠️  Could not set password using sudo mysql"
    echo ""
    echo "💡 Alternative method:"
    echo "   1. Run: sudo mysql"
    echo "   2. Then in MySQL, run:"
    echo "      ALTER USER 'root'@'localhost' IDENTIFIED BY '${PASSWORD}';"
    echo "      FLUSH PRIVILEGES;"
    echo "      EXIT;"
    echo ""
    echo "Or if you know your current MySQL root password, you can:"
    echo "   mysql -u root -p"
    echo "   (Enter current password, then run the ALTER USER command above)"
fi

# Clean up
rm -f "$SQL_FILE"
