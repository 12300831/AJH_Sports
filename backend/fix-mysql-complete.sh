#!/bin/bash

# Complete MySQL Password Fix Script for macOS
# This script will attempt to find MySQL, start it if needed, and set the password

PASSWORD="ajhsports2024"
MYSQL_FOUND=false

echo "🔧 MySQL Password Fix Script"
echo "============================"
echo ""

# Function to find MySQL
find_mysql() {
    # Common paths for MySQL
    PATHS=(
        "/usr/local/bin/mysql"
        "/opt/homebrew/bin/mysql"
        "/usr/local/mysql/bin/mysql"
        "/usr/bin/mysql"
        "/Applications/MySQL*/bin/mysql"
    )
    
    for path in "${PATHS[@]}"; do
        if [ -f "$path" ] || command -v "$path" &> /dev/null; then
            echo "$path"
            return 0
        fi
    done
    
    # Try to find in PATH
    if command -v mysql &> /dev/null; then
        which mysql
        return 0
    fi
    
    return 1
}

# Function to find Homebrew
find_brew() {
    if [ -f "/opt/homebrew/bin/brew" ]; then
        echo "/opt/homebrew/bin/brew"
        return 0
    elif [ -f "/usr/local/bin/brew" ]; then
        echo "/usr/local/bin/brew"
        return 0
    elif command -v brew &> /dev/null; then
        which brew
        return 0
    fi
    return 1
}

# Try to find MySQL
echo "🔍 Searching for MySQL..."
MYSQL_CMD=$(find_mysql)
if [ -n "$MYSQL_CMD" ]; then
    echo "✅ Found MySQL at: $MYSQL_CMD"
    MYSQL_FOUND=true
else
    echo "⚠️  MySQL command not found in standard locations"
fi

# Try to find Homebrew
BREW_CMD=$(find_brew)
if [ -n "$BREW_CMD" ]; then
    echo "✅ Found Homebrew at: $BREW_CMD"
    export PATH="$(dirname $BREW_CMD):$PATH"
    
    echo ""
    echo "🔍 Checking MySQL service status..."
    if $BREW_CMD services list 2>/dev/null | grep -q mysql; then
        STATUS=$($BREW_CMD services list 2>/dev/null | grep mysql | awk '{print $2}')
        echo "MySQL service status: $STATUS"
        
        if [ "$STATUS" != "started" ]; then
            echo ""
            echo "🚀 Starting MySQL service..."
            if $BREW_CMD services start mysql 2>&1; then
                echo "✅ MySQL service started"
                sleep 3
            else
                echo "⚠️  Could not start MySQL service automatically"
            fi
        else
            echo "✅ MySQL service is already running"
        fi
    else
        echo "⚠️  MySQL service not found via Homebrew"
    fi
else
    echo "⚠️  Homebrew not found"
fi

echo ""
echo "=========================================="
echo "Setting MySQL Root Password"
echo "=========================================="
echo ""

# Try to set password using sudo mysql (macOS method)
echo "Method 1: Trying sudo mysql (macOS - no password needed)..."
SQL_FILE=$(mktemp)
cat > "$SQL_FILE" <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED BY '${PASSWORD}';
FLUSH PRIVILEGES;
SELECT 'Password set successfully!' AS status;
EOF

if echo "$SQL_FILE" | sudo mysql 2>/dev/null; then
    echo "✅ Password set using sudo mysql"
    rm -f "$SQL_FILE"
    exit 0
fi

# Try with Node.js script if MySQL is accessible
if [ "$MYSQL_FOUND" = true ] || [ -n "$BREW_CMD" ]; then
    echo ""
    echo "Method 2: Trying Node.js connection script..."
    cd "$(dirname "$0")"
    if node database/set-mysql-password.js 2>&1 | tail -5; then
        echo "✅ Password set using Node.js script"
        rm -f "$SQL_FILE"
        exit 0
    fi
fi

rm -f "$SQL_FILE"

echo ""
echo "❌ Could not set password automatically"
echo ""
echo "📋 Manual Instructions:"
echo "1. Start MySQL (if not running):"
if [ -n "$BREW_CMD" ]; then
    echo "   $BREW_CMD services start mysql"
else
    echo "   brew services start mysql"
fi
echo ""
echo "2. Set the password:"
echo "   sudo mysql"
echo ""
echo "3. Then in MySQL, run:"
echo "   ALTER USER 'root'@'localhost' IDENTIFIED BY '${PASSWORD}';"
echo "   FLUSH PRIVILEGES;"
echo "   EXIT;"
echo ""
echo "4. Verify:"
echo "   mysql -u root -p${PASSWORD} -e \"SELECT 'Success!' AS status;\""
