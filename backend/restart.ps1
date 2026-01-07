# PowerShell script to restart the backend server
Write-Host "🔄 Restarting backend server..." -ForegroundColor Yellow

# Kill port 5001
Write-Host "`n1️⃣  Stopping processes on port 5001..." -ForegroundColor Cyan
& "$PSScriptRoot\kill-port.ps1"

# Wait a moment
Start-Sleep -Seconds 1

# Start the server
Write-Host "`n2️⃣  Starting backend server..." -ForegroundColor Cyan
npm start

