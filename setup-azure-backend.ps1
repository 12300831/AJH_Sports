# Azure Backend Setup Script
# This script helps set up the Azure App Service for ajh-sports-backend

Write-Host "🚀 Azure Backend Setup Script" -ForegroundColor Cyan
Write-Host ""

# Check if Azure CLI is available
$azAvailable = Get-Command az -ErrorAction SilentlyContinue

if (-not $azAvailable) {
    Write-Host "⚠️  Azure CLI not found. Installing..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please install Azure CLI manually:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://aka.ms/installazurecliwindows" -ForegroundColor Cyan
    Write-Host "2. Or run: winget install Microsoft.AzureCLI" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "After installation, restart PowerShell and run this script again." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Alternatively, you can create the App Service using VS Code Azure extension:" -ForegroundColor Yellow
    Write-Host "1. Open backend folder in VS Code" -ForegroundColor Cyan
    Write-Host "2. Click Azure icon → App Service → Create New Web App" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

Write-Host "✅ Azure CLI found" -ForegroundColor Green
Write-Host ""

# Check login status
Write-Host "📋 Checking Azure login status..." -ForegroundColor Yellow
$account = az account show 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Not logged in. Logging in..." -ForegroundColor Yellow
    az login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Login failed!" -ForegroundColor Red
        exit 1
    }
}

$subscription = az account show --query name -o tsv
Write-Host "✅ Logged in to: $subscription" -ForegroundColor Green
Write-Host ""

# Configuration
$resourceGroup = "ajh-sports-rg"
$appServiceName = "ajh-sports-backend"
$location = "australiaeast"  # Australia East
$mysqlServerName = "ajh-sports-mysql"

Write-Host "📝 Configuration:" -ForegroundColor Yellow
Write-Host "   Resource Group: $resourceGroup" -ForegroundColor Gray
Write-Host "   App Service Name: $appServiceName" -ForegroundColor Gray
Write-Host "   Location: $location" -ForegroundColor Gray
Write-Host "   MySQL Server: $mysqlServerName" -ForegroundColor Gray
Write-Host ""

# Get MySQL password
Write-Host "🔐 Please enter your MySQL admin password:" -ForegroundColor Yellow
$mysqlPassword = Read-Host -AsSecureString
$mysqlPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($mysqlPassword)
)

Write-Host ""

# Check if resource group exists
Write-Host "📦 Checking resource group..." -ForegroundColor Yellow
$rgExists = az group exists --name $resourceGroup
if ($rgExists -eq "false") {
    Write-Host "❌ Resource group not found: $resourceGroup" -ForegroundColor Red
    Write-Host "   Please create the MySQL server first in Azure Portal." -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Resource group exists" -ForegroundColor Green
Write-Host ""

# Create App Service Plan
Write-Host "📋 Creating App Service Plan..." -ForegroundColor Yellow
$planName = "ajh-sports-plan"

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

# Create App Service
Write-Host "🚀 Creating App Service..." -ForegroundColor Yellow
az webapp create `
    --resource-group $resourceGroup `
    --plan $planName `
    --name $appServiceName `
    --runtime "NODE:20-lts" `
    --output none

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ App Service created: $appServiceName" -ForegroundColor Green
} else {
    Write-Host "⚠️  App Service might already exist, continuing..." -ForegroundColor Yellow
}
Write-Host ""

# Configure app settings
Write-Host "⚙️  Configuring environment variables..." -ForegroundColor Yellow

# Generate secrets
$jwtSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
$sessionSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})

az webapp config appsettings set `
    --resource-group $resourceGroup `
    --name $appServiceName `
    --settings `
        NODE_ENV="production" `
        PORT="5001" `
        DB_HOST="$mysqlServerName.mysql.database.azure.com" `
        DB_PORT="3306" `
        DB_USER="ajhsportsadmin@$mysqlServerName" `
        DB_PASS="$mysqlPasswordPlain" `
        DB_NAME="ajh_sports" `
        JWT_SECRET="$jwtSecret" `
        SESSION_SECRET="$sessionSecret" `
        FRONTEND_URL="https://ajh-sports-308b4.web.app" `
    --output none

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Environment variables configured" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to configure environment variables" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Set startup command
Write-Host "🔧 Setting startup command..." -ForegroundColor Yellow
az webapp config set `
    --resource-group $resourceGroup `
    --name $appServiceName `
    --startup-file "npm start" `
    --output none

Write-Host "✅ Startup command set" -ForegroundColor Green
Write-Host ""

Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Your App Service URL:" -ForegroundColor Cyan
Write-Host "   https://$appServiceName.azurewebsites.net" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Deploy your backend code from VS Code:" -ForegroundColor Gray
Write-Host "      - Open backend folder in VS Code" -ForegroundColor Gray
Write-Host "      - Azure panel → App Service → Right-click '$appServiceName' → Deploy to Web App" -ForegroundColor Gray
Write-Host "   2. Test: https://$appServiceName.azurewebsites.net/api/health" -ForegroundColor Gray
Write-Host ""
