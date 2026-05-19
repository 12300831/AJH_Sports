# PowerShell script to configure Azure App Service request size limit
# This fixes the 413 "Request Entity Too Large" error

Write-Host "🔧 Configuring Azure App Service request size limit..." -ForegroundColor Cyan

# Get Azure subscription and resource group
$appServiceName = "ajh-sports-backend"
$resourceGroup = Read-Host "Enter your Azure Resource Group name (or press Enter to auto-detect)"

# If resource group not provided, try to get it from Azure
if ([string]::IsNullOrWhiteSpace($resourceGroup)) {
    Write-Host "🔍 Attempting to find resource group for $appServiceName..." -ForegroundColor Yellow
    try {
        $webApp = az webapp show --name $appServiceName --query "{resourceGroup:resourceGroup}" --output json | ConvertFrom-Json
        $resourceGroup = $webApp.resourceGroup
        Write-Host "✅ Found resource group: $resourceGroup" -ForegroundColor Green
    } catch {
        Write-Host "❌ Could not auto-detect resource group. Please provide it manually." -ForegroundColor Red
        $resourceGroup = Read-Host "Enter your Azure Resource Group name"
    }
}

Write-Host "`n📋 Setting application settings..." -ForegroundColor Cyan

# Set NGINX_MAX_BODY_SIZE for Linux App Service (25MB)
Write-Host "Setting NGINX_MAX_BODY_SIZE=25m..." -ForegroundColor Yellow
try {
    az webapp config appsettings set `
        --name $appServiceName `
        --resource-group $resourceGroup `
        --settings NGINX_MAX_BODY_SIZE=25m `
        --output none
    
    Write-Host "✅ NGINX_MAX_BODY_SIZE set successfully!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not set NGINX_MAX_BODY_SIZE. This might be a Windows App Service (uses web.config instead)." -ForegroundColor Yellow
}

# Restart the app service
Write-Host "`n🔄 Restarting App Service..." -ForegroundColor Cyan
try {
    az webapp restart --name $appServiceName --resource-group $resourceGroup --output none
    Write-Host "✅ App Service restarted successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to restart App Service. Please restart manually from Azure Portal." -ForegroundColor Red
}

Write-Host "`n✅ Configuration complete!" -ForegroundColor Green
Write-Host "`n📝 Note: The backend code with 20MB Express limit and web.config has been updated." -ForegroundColor Cyan
Write-Host "   After deploying the backend, 10MB image uploads should work." -ForegroundColor Cyan
