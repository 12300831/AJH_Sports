# PowerShell script to kill process using port 5001 (or specified port)
param(
    [int]$Port = 5001
)

Write-Host "🔍 Checking for processes using port $Port..." -ForegroundColor Yellow

try {
    # Find process using the port
    $process = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | 
        Select-Object -ExpandProperty OwningProcess -Unique
    
    if ($process) {
        Write-Host "🔍 Found process $process using port $Port" -ForegroundColor Yellow
        Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
        Write-Host "✅ Killed process $process" -ForegroundColor Green
    } else {
        Write-Host "✅ No process found using port $Port" -ForegroundColor Green
    }
} catch {
    Write-Host "✅ Port $Port is free" -ForegroundColor Green
}

