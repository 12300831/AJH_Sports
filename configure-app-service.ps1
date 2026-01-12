# Configure Azure App Service Environment Variables
# Run this script and enter your MySQL password when prompted

$env:Path += ";C:\Program Files\Microsoft SDKs\Azure\CLI2\wbin"

Write-Host "⚙️  Configuring Azure App Service Environment Variables" -ForegroundColor Cyan
Write-Host ""

# Get MySQL password
Write-Host "Please enter your MySQL admin password:" -ForegroundColor Yellow
$mysqlPassword = Read-Host -AsSecureString
$mysqlPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($mysqlPassword)
)

Write-Host ""
Write-Host "Generating secrets..." -ForegroundColor Yellow

# Generate random secrets
$jwtSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
$sessionSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

Write-Host "Configuring App Service settings..." -ForegroundColor Yellow

az webapp config appsettings set `
    --resource-group ajh-sports-rg `
    --name ajh-sports-backend `
    --settings `
        NODE_ENV="production" `
        PORT="5001" `
        DB_HOST="ajh-sports-mysql.mysql.database.azure.com" `
        DB_PORT="3306" `
        DB_USER="ajhsportsadmin@ajh-sports-mysql" `
        DB_PASS="$mysqlPasswordPlain" `
        DB_NAME="ajh_sports" `
        JWT_SECRET="$jwtSecret" `
        SESSION_SECRET="$sessionSecret" `
        FRONTEND_URL="https://ajh-sports-308b4.web.app" `
    --output none

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Environment variables configured successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔧 Setting startup command..." -ForegroundColor Yellow
    
    az webapp config set `
        --resource-group ajh-sports-rg `
        --name ajh-sports-backend `
        --startup-file "npm start" `
        --output none
    
    Write-Host "✅ Startup command configured" -ForegroundColor Green
    Write-Host ""
    Write-Host "✅ Setup Complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Your App Service URL:" -ForegroundColor Cyan
    Write-Host "   https://ajh-sports-backend.azurewebsites.net" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next: Deploy your code from VS Code" -ForegroundColor Yellow
    Write-Host "   1. Open backend folder in VS Code" -ForegroundColor Gray
    Write-Host "   2. Azure panel → Right-click 'ajh-sports-backend' → Deploy to Web App" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Failed to configure settings" -ForegroundColor Red
    Write-Host "Please check your MySQL password and try again" -ForegroundColor Yellow
}
