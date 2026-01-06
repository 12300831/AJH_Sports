#!/bin/bash

# Set MySQL root password to match .env file
# This script will set MySQL password to: admin123

echo "🔐 Setting MySQL root password to: admin123"
echo "You will be prompted for your macOS password (sudo)..."
echo ""

sudo mysql <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED BY 'admin123';
FLUSH PRIVILEGES;
SELECT 'Password set successfully!' AS Status;
EXIT;
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ MySQL password set to: admin123"
    echo "✅ This matches your .env file"
    echo ""
    echo "💡 Next steps:"
    echo "   1. Test connection: node database/test-db-connection.js"
    echo "   2. Restart backend: npm restart"
else
    echo ""
    echo "❌ Failed to set MySQL password"
    echo ""
    echo "💡 Try running manually:"
    echo "   sudo mysql"
    echo "   Then in MySQL run:"
    echo "   ALTER USER 'root'@'localhost' IDENTIFIED BY 'admin123';"
    echo "   FLUSH PRIVILEGES;"
    echo "   EXIT;"
fi

