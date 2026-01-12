#!/bin/bash
# Azure App Service deployment script
# This script runs after code is deployed

echo "Installing dependencies..."
npm install --production

echo "Starting application..."
npm start
