# Quick MySQL Start Script
# This script starts MySQL if it's already installed as a service

Write-Host "Starting MySQL Service..." -ForegroundColor Cyan

$serviceName = "MySQL80"
$service = Get-Service -Name $serviceName -ErrorAction SilentlyContinue

if (-not $service) {
    Write-Host "MySQL service '$serviceName' not found." -ForegroundColor Red
    Write-Host "Please run setup-mysql-service.ps1 as Administrator first." -ForegroundColor Yellow
    exit 1
}

if ($service.Status -eq 'Running') {
    Write-Host "MySQL is already running!" -ForegroundColor Green
    Get-Service -Name $serviceName | Format-Table Name, Status -AutoSize
    exit 0
}

try {
    Start-Service -Name $serviceName
    Start-Sleep -Seconds 3
    
    if ((Get-Service -Name $serviceName).Status -eq 'Running') {
        Write-Host "MySQL started successfully!" -ForegroundColor Green
        Get-Service -Name $serviceName | Format-Table Name, Status -AutoSize
    } else {
        Write-Host "Failed to start MySQL service." -ForegroundColor Red
        Write-Host "You may need to run this as Administrator." -ForegroundColor Yellow
    }
} catch {
    Write-Host "Error starting MySQL: $_" -ForegroundColor Red
    Write-Host "You may need Administrator privileges." -ForegroundColor Yellow
}

