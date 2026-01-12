# Alternative deployment method using Git
# This uses Azure's built-in Git deployment

$env:Path += ";C:\Program Files\Microsoft SDKs\Azure\CLI2\wbin"

Write-Host "🚀 Setting up Git deployment..." -ForegroundColor Yellow

# Enable local Git deployment
az webapp deployment source config-local-git `
    --resource-group ajh-sports-rg `
    --name ajh-sports-backend `
    --output none

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Git deployment configured" -ForegroundColor Green
    
    # Get deployment URL
    $gitUrl = az webapp deployment source show `
        --resource-group ajh-sports-rg `
        --name ajh-sports-backend `
        --query "url" -o tsv
    
    Write-Host ""
    Write-Host "📋 Deployment URL:" -ForegroundColor Cyan
    Write-Host "   $gitUrl" -ForegroundColor Green
    Write-Host ""
    Write-Host "To deploy, run from backend folder:" -ForegroundColor Yellow
    Write-Host "   git init" -ForegroundColor Gray
    Write-Host "   git add ." -ForegroundColor Gray
    Write-Host "   git commit -m 'Deploy to Azure'" -ForegroundColor Gray
    Write-Host "   git remote add azure $gitUrl" -ForegroundColor Gray
    Write-Host "   git push azure master" -ForegroundColor Gray
} else {
    Write-Host "❌ Failed to configure Git deployment" -ForegroundColor Red
}
