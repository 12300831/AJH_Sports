# Automated Azure App Service Creation Script
# This script creates the App Service and configures all settings

param(
    [Parameter(Mandatory=$false)]
    [string]$MySQLPassword = ""
)

Write-Host "🚀 Automated Azure Backend Setup" -ForegroundColor Cyan
Write-Host ""

# Check for Azure CLI
$azPath = Get-Command az -ErrorAction SilentlyContinue

if (-not $azPath) {
    Write-Host "❌ Azure CLI not found in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Azure CLI first:" -ForegroundColor Yellow
    Write-Host "1. Download: https://aka.ms/installazurecliwindows" -ForegroundColor Cyan
    Write-Host "2. Install it" -ForegroundColor Cyan
    Write-Host "3. Restart PowerShell" -ForegroundColor Cyan
    Write-Host "4. Run: az login" -ForegroundColor Cyan
    Write-Host "5. Run this script again" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "OR use VS Code Azure extension (see VS_CODE_AZURE_SETUP.md)" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Azure CLI found" -ForegroundColor Green

# Check login
Write-Host "📋 Checking Azure login..." -ForegroundColor Yellow
$account = az account show 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Not logged in. Please run: az login" -ForegroundColor Yellow
    exit 1
}

$subName = az account show --query name -o tsv
Write-Host "✅ Logged in to: $subName" -ForegroundColor Green
Write-Host ""

# Configuration
$resourceGroup = "ajh-sports-rg"
$appServiceName = "ajh-sports-backend"
$location = "australiaeast"
$mysqlServerName = "ajh-sports-mysql"
$planName = "ajh-sports-plan"

# Get MySQL password if not provided
if ([string]::IsNullOrEmpty($MySQLPassword)) {
    Write-Host "🔐 Enter your MySQL admin password:" -ForegroundColor Yellow
    $securePass = Read-Host -AsSecureString
    $MySQLPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePass)
    )
}

Write-Host ""
Write-Host "📦 Creating App Service Plan..." -ForegroundColor Yellow
az appservice plan create `
    --name $planName `
    --resource-group $resourceGroup `
    --location $location `
    --sku B1 `
    --is-linux `
    --output none

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ App Service Plan created" -ForegroundColor Green
} else {
    Write-Host "⚠️  Plan might already exist, continuing..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🚀 Creating App Service..." -ForegroundColor Yellow
az webapp create `
    --resource-group $resourceGroup `
    --plan $planName `
    --name $appServiceName `
    --runtime "NODE:20-lts" `
    --output none

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ App Service created" -ForegroundColor Green
} else {
    Write-Host "⚠️  App Service might already exist, continuing..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "⚙️  Configuring environment variables..." -ForegroundColor Yellow

# Generate random secrets
$jwtSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
$sessionSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

az webapp config appsettings set `
    --resource-group $resourceGroup `
    --name $appServiceName `
    --settings `
        NODE_ENV="production" `
        PORT="5001" `
        DB_HOST="$mysqlServerName.mysql.database.azure.com" `
        DB_PORT="3306" `
        DB_USER="ajhsportsadmin@$mysqlServerName" `
        DB_PASS="$MySQLPassword" `
        DB_NAME="ajh_sports" `
        JWT_SECRET="$jwtSecret" `
        SESSION_SECRET="$sessionSecret" `
        FRONTEND_URL="https://ajh-sports-308b4.web.app" `
    --output none

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Environment variables configured" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to configure settings" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔧 Setting startup command..." -ForegroundColor Yellow
az webapp config set `
    --resource-group $resourceGroup `
    --name $appServiceName `
    --startup-file "npm start" `
    --output none

Write-Host "✅ Startup command configured" -ForegroundColor Green
Write-Host ""

Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Your App Service URL:" -ForegroundColor Cyan
Write-Host "   https://$appServiceName.azurewebsites.net" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next: Deploy code from VS Code" -ForegroundColor Yellow
Write-Host "   1. Open backend folder in VS Code" -ForegroundColor Gray
Write-Host "   2. Azure panel → Right-click '$appServiceName' → Deploy to Web App" -ForegroundColor Gray
Write-Host ""
