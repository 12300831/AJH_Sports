#!/bin/bash

# Quick script to set MySQL password and update .env file
# Usage: ./quick-setup-db-password.sh [password]

ENV_FILE=".env"
PASSWORD="${1:-admin123}"

echo "🔐 Setting up MySQL password..."
echo ""

# Step 1: Set MySQL password
echo "Step 1: Setting MySQL root password to: $PASSWORD"
echo "You may be prompted for your macOS password (sudo)..."
echo ""

sudo mysql <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED BY '$PASSWORD';
FLUSH PRIVILEGES;
EXIT;
EOF

if [ $? -eq 0 ]; then
    echo "✅ MySQL password set successfully"
else
    echo "❌ Failed to set MySQL password"
    echo "💡 You may need to set it manually:"
    echo "   sudo mysql"
    echo "   ALTER USER 'root'@'localhost' IDENTIFIED BY '$PASSWORD';"
    echo "   FLUSH PRIVILEGES;"
    echo "   EXIT;"
    exit 1
fi

echo ""
echo "Step 2: Updating .env file..."

# Step 2: Update .env file
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ .env file not found!"
    exit 1
fi

# Check if DB_PASS exists and update it, or add it
if grep -q "^DB_PASS=" "$ENV_FILE"; then
    # Update existing DB_PASS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/^DB_PASS=.*/DB_PASS=$PASSWORD/" "$ENV_FILE"
    else
        # Linux
        sed -i "s/^DB_PASS=.*/DB_PASS=$PASSWORD/" "$ENV_FILE"
    fi
    echo "✅ Updated DB_PASS in .env file"
else
    # Add DB_PASS after DB_USER
    if grep -q "^DB_USER=" "$ENV_FILE"; then
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "/^DB_USER=/a\\
DB_PASS=$PASSWORD" "$ENV_FILE"
        else
            # Linux
            sed -i "/^DB_USER=/a DB_PASS=$PASSWORD" "$ENV_FILE"
        fi
        echo "✅ Added DB_PASS to .env file"
    else
        echo "DB_PASS=$PASSWORD" >> "$ENV_FILE"
        echo "✅ Appended DB_PASS to .env file"
    fi
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Summary:"
echo "   MySQL password: $PASSWORD"
echo "   .env file updated: $ENV_FILE"
echo ""
echo "💡 Next steps:"
echo "   1. Restart backend: npm restart"
echo "   2. Test connection: node database/test-db-connection.js"

