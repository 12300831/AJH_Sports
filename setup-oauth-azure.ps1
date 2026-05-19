# OAuth Azure Configuration Script
# This script will set up all OAuth environment variables in Azure App Service

param(
    [Parameter(Mandatory=$true)]
    [string]$GoogleClientId,
    
    [Parameter(Mandatory=$true)]
    [string]$GoogleClientSecret,
    
    [Parameter(Mandatory=$true)]
    [string]$FacebookAppId,
    
    [Parameter(Mandatory=$true)]
    [string]$FacebookAppSecret
)

$appServiceName = "ajh-sports-backend"
$resourceGroup = "ajh-sports-rg"
$backendUrl = "https://ajh-sports-backend.azurewebsites.net"
$frontendUrl = "https://ajh-sports-308b4.web.app"

Write-Host "🚀 Setting up OAuth environment variables in Azure..." -ForegroundColor Cyan
Write-Host ""

# Set all environment variables at once
Write-Host "📝 Adding/updating environment variables..." -ForegroundColor Yellow

az webapp config appsettings set `
    --name $appServiceName `
    --resource-group $resourceGroup `
    --settings `
        GOOGLE_CLIENT_ID="$GoogleClientId" `
        GOOGLE_CLIENT_SECRET="$GoogleClientSecret" `
        FACEBOOK_APP_ID="$FacebookAppId" `
        FACEBOOK_APP_SECRET="$FacebookAppSecret" `
        BACKEND_URL="$backendUrl" `
        FRONTEND_URL="$frontendUrl" `
    --output none

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Successfully set all OAuth environment variables!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Verifying configuration..." -ForegroundColor Yellow
    
    # Verify the settings were set
    az webapp config appsettings list `
        --name $appServiceName `
        --resource-group $resourceGroup `
        --query "[?name=='GOOGLE_CLIENT_ID' || name=='GOOGLE_CLIENT_SECRET' || name=='FACEBOOK_APP_ID' || name=='FACEBOOK_APP_SECRET' || name=='BACKEND_URL' || name=='FRONTEND_URL'].{Name:name, Value:value}" `
        --output table
    
    Write-Host ""
    Write-Host "🔄 Restarting App Service to apply changes..." -ForegroundColor Yellow
    az webapp restart --name $appServiceName --resource-group $resourceGroup --output none
    
    Write-Host ""
    Write-Host "✅ Done! OAuth should now be configured." -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  Next steps:" -ForegroundColor Cyan
    Write-Host "1. Wait 30-60 seconds for the app to restart"
    Write-Host "2. Check the logs: az webapp log tail --name $appServiceName --resource-group $resourceGroup"
    Write-Host "3. Look for: '✅ Google OAuth strategy initialized' and '✅ Facebook OAuth strategy initialized'"
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Failed to set environment variables. Please check your Azure CLI login." -ForegroundColor Red
    Write-Host "Try running: az login" -ForegroundColor Yellow
}
