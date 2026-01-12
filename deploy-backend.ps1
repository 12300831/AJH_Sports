# Deploy Backend to Azure
Write-Host "`n🚀 Deploying backend to Azure..." -ForegroundColor Cyan

# Navigate to backend folder
cd backend

# Create zip file (excluding node_modules and .env)
Write-Host "`n📦 Creating deployment package..." -ForegroundColor Yellow
$zipPath = "..\backend-deploy.zip"

# Remove old zip if exists
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

# Create zip excluding node_modules, .env, .git
Get-ChildItem -Path . -Exclude node_modules,.env,.git,*.log | 
    Compress-Archive -DestinationPath $zipPath -CompressionLevel Fastest

if (Test-Path $zipPath) {
    $size = (Get-Item $zipPath).Length / 1MB
    Write-Host "✅ Created: backend-deploy.zip ($([math]::Round($size, 2)) MB)" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to create zip" -ForegroundColor Red
    exit 1
}

# Deploy to Azure
Write-Host "`n📤 Deploying to Azure App Service..." -ForegroundColor Yellow
Write-Host "App Service: ajh-sports-backend" -ForegroundColor White

az webapp deploy `
    --resource-group ajh-sports-rg `
    --name ajh-sports-backend `
    --src-path $zipPath `
    --type zip

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Deployment successful!" -ForegroundColor Green
    Write-Host "`n⏳ Waiting 30 seconds for app to restart..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
    
    Write-Host "`n🧪 Testing /api/setup endpoint..." -ForegroundColor Cyan
    try {
        $response = Invoke-WebRequest -Uri "https://ajh-sports-backend.azurewebsites.net/api/setup" -Method POST -UseBasicParsing
        Write-Host "✅ Setup endpoint is working!" -ForegroundColor Green
        Write-Host $response.Content
    } catch {
        Write-Host "⚠️  Setup endpoint not ready yet. Try again in a minute." -ForegroundColor Yellow
    }
} else {
    Write-Host "`n❌ Deployment failed!" -ForegroundColor Red
    Write-Host "Try deploying from VS Code instead:" -ForegroundColor Yellow
    Write-Host "  1. Open backend folder in VS Code" -ForegroundColor White
    Write-Host "  2. Azure panel → Right-click ajh-sports-backend → Deploy" -ForegroundColor White
}

# Cleanup
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
    Write-Host "`n🧹 Cleaned up deployment package" -ForegroundColor Gray
}
