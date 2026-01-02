# Final Fix for MySQL Service
# Run as Administrator

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MySQL Service Final Fix" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin"
$dataDir = "C:\ProgramData\MySQL\MySQL Server 8.0\Data"

Push-Location $mysqlPath

# Step 1: Remove the corrupted service
Write-Host "Step 1: Removing existing service..." -ForegroundColor Cyan
& .\mysqld.exe --remove MySQL80 2>&1 | Out-Null
Start-Sleep -Seconds 2
Write-Host "Service removed" -ForegroundColor Green

# Step 2: Reinstall the service with proper configuration
Write-Host ""
Write-Host "Step 2: Reinstalling MySQL service..." -ForegroundColor Cyan

# Check if config file exists
$configFile = "C:\ProgramData\MySQL\MySQL Server 8.0\my.ini"
if (Test-Path $configFile) {
    Write-Host "Using config file: $configFile" -ForegroundColor Yellow
    $result = & .\mysqld.exe --install MySQL80 --defaults-file=$configFile 2>&1
} else {
    Write-Host "No config file found, using defaults" -ForegroundColor Yellow
    $result = & .\mysqld.exe --install MySQL80 2>&1
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "Service installed successfully" -ForegroundColor Green
} else {
    Write-Host "Installation output: $result" -ForegroundColor Yellow
}

# Step 3: Configure service
Write-Host ""
Write-Host "Step 3: Configuring service..." -ForegroundColor Cyan
Set-Service -Name "MySQL80" -StartupType Automatic -ErrorAction SilentlyContinue

# Step 4: Start the service
Write-Host ""
Write-Host "Step 4: Starting MySQL service..." -ForegroundColor Cyan

try {
    Start-Service -Name "MySQL80" -ErrorAction Stop
    Start-Sleep -Seconds 5
    
    $service = Get-Service -Name "MySQL80"
    if ($service.Status -eq 'Running') {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "SUCCESS! MySQL Service is Running!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Get-Service -Name "MySQL80" | Format-Table Name, Status, StartType -AutoSize
        
        Write-Host ""
        Write-Host "Testing connection..." -ForegroundColor Cyan
        $connectionTest = Test-NetConnection -ComputerName localhost -Port 3306 -InformationLevel Quiet -WarningAction SilentlyContinue
        if ($connectionTest) {
            Write-Host "MySQL is accepting connections on port 3306!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Next step: Run 'cd backend && npm run db:setup'" -ForegroundColor Yellow
        } else {
            Write-Host "Port 3306 test failed, but service is running." -ForegroundColor Yellow
            Write-Host "MySQL may need a moment to fully start." -ForegroundColor Yellow
        }
    } else {
        Write-Host "Service status: $($service.Status)" -ForegroundColor Red
        Write-Host ""
        Write-Host "Checking error logs..." -ForegroundColor Yellow
        
        $errorLogs = Get-ChildItem "$dataDir\*.err" -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending
        if ($errorLogs) {
            Write-Host "Latest error log: $($errorLogs[0].FullName)" -ForegroundColor Yellow
            Write-Host "Last 20 lines:" -ForegroundColor Cyan
            Get-Content $errorLogs[0].FullName -Tail 20
        }
    }
} catch {
    Write-Host "Error starting service: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Trying alternative: Start MySQL manually to see errors" -ForegroundColor Yellow
    Write-Host "Run this command to see what's wrong:" -ForegroundColor Cyan
    Write-Host "cd '$mysqlPath' ; .\mysqld.exe --console --datadir=$dataDir" -ForegroundColor White
}

Pop-Location

Write-Host ""
Write-Host "Fix complete." -ForegroundColor Cyan

