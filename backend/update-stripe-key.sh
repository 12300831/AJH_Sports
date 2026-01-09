#!/bin/bash

# Script to update Stripe API key in .env file

echo "🔑 Stripe API Key Updater"
echo "=========================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    exit 1
fi

# Ask for Stripe Secret Key
echo "Please enter your Stripe Secret Key (starts with sk_test_):"
read -s STRIPE_KEY

if [ -z "$STRIPE_KEY" ]; then
    echo "❌ No key provided. Exiting."
    exit 1
fi

# Ask for Webhook Secret (optional)
echo ""
echo "Please enter your Stripe Webhook Secret (optional, press Enter to skip):"
read -s WEBHOOK_SECRET

# Update .env file
if [ -n "$WEBHOOK_SECRET" ]; then
    # Update both keys
    sed -i.bak "s|STRIPE_SECRET_KEY=.*|STRIPE_SECRET_KEY=$STRIPE_KEY|" .env
    sed -i.bak "s|STRIPE_WEBHOOK_SECRET=.*|STRIPE_WEBHOOK_SECRET=$WEBHOOK_SECRET|" .env
    echo "✅ Updated both Stripe Secret Key and Webhook Secret"
else
    # Update only secret key
    sed -i.bak "s|STRIPE_SECRET_KEY=.*|STRIPE_SECRET_KEY=$STRIPE_KEY|" .env
    echo "✅ Updated Stripe Secret Key"
fi

# Remove backup file
rm -f .env.bak

echo ""
echo "✅ Done! Please restart your backend server for changes to take effect."
echo ""
