# Comprehensive MySQL Diagnosis
# Run as Administrator

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MySQL Comprehensive Diagnosis" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check service status
Write-Host "1. Service Status:" -ForegroundColor Yellow
Get-Service -Name "MySQL80" -ErrorAction SilentlyContinue | Format-List *

# Check port
Write-Host ""
Write-Host "2. Port 3306 Status:" -ForegroundColor Yellow
$portCheck = netstat -ano | findstr :3306
if ($portCheck) {
    Write-Host "Port 3306 is in use:" -ForegroundColor Red
    Write-Host $portCheck
} else {
    Write-Host "Port 3306 is free" -ForegroundColor Green
}

# Check Windows Event Log
Write-Host ""
Write-Host "3. Windows Event Log (MySQL errors):" -ForegroundColor Yellow
$events = Get-EventLog -LogName System -Source MySQL* -Newest 10 -ErrorAction SilentlyContinue
if ($events) {
    $events | Format-Table TimeGenerated, EntryType, Message -Wrap
} else {
    Write-Host "No MySQL events in System log" -ForegroundColor Gray
}

# Check Application Event Log
Write-Host ""
Write-Host "4. Application Event Log (MySQL errors):" -ForegroundColor Yellow
$appEvents = Get-EventLog -LogName Application -Source MySQL* -Newest 10 -ErrorAction SilentlyContinue
if ($appEvents) {
    $appEvents | Format-Table TimeGenerated, EntryType, Message -Wrap
} else {
    Write-Host "No MySQL events in Application log" -ForegroundColor Gray
}

# Check error log
Write-Host ""
Write-Host "5. MySQL Error Log:" -ForegroundColor Yellow
$errorLog = Get-ChildItem "C:\ProgramData\MySQL\MySQL Server 8.0\Data\*.err" -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if ($errorLog) {
    Write-Host "Log file: $($errorLog.FullName)" -ForegroundColor Cyan
    Write-Host "Last 30 lines:" -ForegroundColor Cyan
    Get-Content $errorLog.FullName -Tail 30
} else {
    Write-Host "No error log found" -ForegroundColor Gray
}

# Check data directory
Write-Host ""
Write-Host "6. Data Directory:" -ForegroundColor Yellow
$dataDir = "C:\ProgramData\MySQL\MySQL Server 8.0\Data"
if (Test-Path $dataDir) {
    Write-Host "Data directory exists: $dataDir" -ForegroundColor Green
    $acl = Get-Acl $dataDir
    Write-Host "Owner: $($acl.Owner)" -ForegroundColor Cyan
} else {
    Write-Host "Data directory NOT found: $dataDir" -ForegroundColor Red
}

# Check config file
Write-Host ""
Write-Host "7. Configuration File:" -ForegroundColor Yellow
$configFile = "C:\ProgramData\MySQL\MySQL Server 8.0\my.ini"
if (Test-Path $configFile) {
    Write-Host "Config file exists: $configFile" -ForegroundColor Green
} else {
    Write-Host "Config file NOT found: $configFile" -ForegroundColor Yellow
    Write-Host "MySQL will use default settings" -ForegroundColor Gray
}

# Try to get service details
Write-Host ""
Write-Host "8. Service Details:" -ForegroundColor Yellow
try {
    $service = Get-WmiObject Win32_Service -Filter "Name='MySQL80'" -ErrorAction SilentlyContinue
    if ($service) {
        Write-Host "Service Account: $($service.StartName)" -ForegroundColor Cyan
        Write-Host "Service Path: $($service.PathName)" -ForegroundColor Cyan
        Write-Host "Service State: $($service.State)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "Could not get service details: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Diagnosis Complete" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

