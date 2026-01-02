# Start MySQL Service After Initialization
# Run as Administrator

Write-Host "Starting MySQL Service..." -ForegroundColor Cyan

# Check if service exists
$service = Get-Service -Name "MySQL80" -ErrorAction SilentlyContinue

if (-not $service) {
    Write-Host "ERROR: MySQL80 service not found!" -ForegroundColor Red
    Write-Host "Please run fix-mysql-service.ps1 first." -ForegroundColor Yellow
    exit 1
}

Write-Host "Service Status: $($service.Status)" -ForegroundColor Yellow

if ($service.Status -eq 'Running') {
    Write-Host "MySQL is already running!" -ForegroundColor Green
    Get-Service -Name "MySQL80" | Format-Table Name, Status, StartType -AutoSize
    exit 0
}

# Try to start the service
Write-Host "Attempting to start MySQL service..." -ForegroundColor Cyan

try {
    Start-Service -Name "MySQL80" -ErrorAction Stop
    Start-Sleep -Seconds 5
    
    $service = Get-Service -Name "MySQL80"
    if ($service.Status -eq 'Running') {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "MySQL Service Started Successfully!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Get-Service -Name "MySQL80" | Format-Table Name, Status, StartType -AutoSize
        Write-Host ""
        Write-Host "Testing connection..." -ForegroundColor Cyan
        Test-NetConnection -ComputerName localhost -Port 3306 -InformationLevel Quiet
        if ($?) {
            Write-Host "MySQL is accepting connections on port 3306!" -ForegroundColor Green
        }
    } else {
        Write-Host "Service started but status is: $($service.Status)" -ForegroundColor Yellow
        
        # Check error log
        $errorLogs = Get-ChildItem "C:\ProgramData\MySQL\MySQL Server 8.0\Data\*.err" -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending
        if ($errorLogs) {
            Write-Host ""
            Write-Host "Latest error log entries:" -ForegroundColor Yellow
            Get-Content $errorLogs[0].FullName -Tail 30
        }
    }
} catch {
    Write-Host "Failed to start service: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Checking error logs..." -ForegroundColor Yellow
    
    $errorLogs = Get-ChildItem "C:\ProgramData\MySQL\MySQL Server 8.0\Data\*.err" -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending
    if ($errorLogs) {
        Write-Host "Latest error log: $($errorLogs[0].FullName)" -ForegroundColor Yellow
        Write-Host "Last 30 lines:" -ForegroundColor Cyan
        Get-Content $errorLogs[0].FullName -Tail 30
    }
    
    Write-Host ""
    Write-Host "Trying to start MySQL manually to see errors..." -ForegroundColor Yellow
    Write-Host "This will run in the foreground - press Ctrl+C to stop" -ForegroundColor Yellow
    Write-Host ""
    
    $mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin"
    $dataDir = "C:\ProgramData\MySQL\MySQL Server 8.0\Data"
    
    Push-Location $mysqlPath
    Write-Host "Starting: .\mysqld.exe --console --datadir=$dataDir" -ForegroundColor Cyan
    Write-Host ""
    & .\mysqld.exe --console --datadir=$dataDir
    Pop-Location
}

