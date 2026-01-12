#!/bin/bash
# Azure App Service startup script
# This ensures dependencies are installed before starting the app

cd /home/site/wwwroot

echo "Checking for node_modules..."
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
    echo "Installing dependencies..."
    npm install --production
    echo "Dependencies installed!"
else
    echo "Dependencies already installed, skipping..."
fi

echo "Starting application..."
npm start
