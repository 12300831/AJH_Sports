# Firebase Deployment Script
# Run this script to deploy your frontend to Firebase Hosting

Write-Host "🚀 Starting Firebase Deployment..." -ForegroundColor Cyan
Write-Host ""

# Check if Firebase CLI is installed
if (-not (Get-Command firebase -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Firebase CLI not found. Installing..." -ForegroundColor Red
    npm install -g firebase-tools
}

# Check if logged in
Write-Host "📋 Checking Firebase login status..." -ForegroundColor Yellow
$loginStatus = firebase login:list 2>&1

if ($loginStatus -match "No authorized accounts") {
    Write-Host ""
    Write-Host "⚠️  You need to login to Firebase first!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please run this command in your terminal:" -ForegroundColor Cyan
    Write-Host "  firebase login" -ForegroundColor Green
    Write-Host ""
    Write-Host "This will open a browser window for you to authenticate." -ForegroundColor Gray
    Write-Host ""
    $response = Read-Host "Have you logged in? (y/n)"
    if ($response -ne "y") {
        Write-Host "❌ Please login first and run this script again." -ForegroundColor Red
        exit 1
    }
}

# Navigate to root directory
Set-Location $PSScriptRoot

# Build frontend
Write-Host ""
Write-Host "📦 Building frontend..." -ForegroundColor Yellow
Set-Location frontend

# Set API URL for production build
$env:VITE_API_URL = "https://ajh-sports-backend.azurewebsites.net/api"
Write-Host "🔗 Using API URL: $env:VITE_API_URL" -ForegroundColor Cyan

npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}
Set-Location ..

# Deploy to Firebase
Write-Host ""
Write-Host "🚀 Deploying to Firebase Hosting..." -ForegroundColor Yellow
firebase deploy --only hosting --project ajh-sports-308b4

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Your site is live at:" -ForegroundColor Cyan
    Write-Host "   https://ajh-sports-308b4.web.app" -ForegroundColor Green
    Write-Host "   https://ajh-sports-308b4.firebaseapp.com" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}
