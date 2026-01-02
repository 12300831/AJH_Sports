# Fix MySQL Service with Proper Configuration
# Run as Administrator

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MySQL Service Fix with Configuration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin"
$dataDir = "C:\ProgramData\MySQL\MySQL Server 8.0\Data"
$configDir = "C:\ProgramData\MySQL\MySQL Server 8.0"
$configFile = "$configDir\my.ini"

# Step 1: Create configuration file
Write-Host "Step 1: Creating MySQL configuration file..." -ForegroundColor Cyan

if (-not (Test-Path $configDir)) {
    New-Item -ItemType Directory -Path $configDir -Force | Out-Null
}

$configContent = @"
[mysqld]
# MySQL Server Configuration
datadir=$dataDir
port=3306
default_authentication_plugin=mysql_native_password

# Logging
log-error=$dataDir\mysql.err
general-log=0
slow-query-log=0

# Performance
max_connections=151
table_open_cache=2000

# InnoDB
innodb_buffer_pool_size=128M
innodb_log_file_size=48M

# Service Configuration
"@

$configContent | Out-File -FilePath $configFile -Encoding ASCII
Write-Host "Config file created: $configFile" -ForegroundColor Green

# Step 2: Remove existing service
Write-Host ""
Write-Host "Step 2: Removing existing service..." -ForegroundColor Cyan
Push-Location $mysqlPath
& .\mysqld.exe --remove MySQL80 2>&1 | Out-Null
Start-Sleep -Seconds 2
Write-Host "Service removed" -ForegroundColor Green

# Step 3: Reinstall service with config file
Write-Host ""
Write-Host "Step 3: Reinstalling service with configuration..." -ForegroundColor Cyan
$result = & .\mysqld.exe --install MySQL80 --defaults-file=$configFile 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "Service installed successfully" -ForegroundColor Green
} else {
    Write-Host "Installation output: $result" -ForegroundColor Yellow
}

# Step 4: Configure service
Write-Host ""
Write-Host "Step 4: Configuring service..." -ForegroundColor Cyan
Set-Service -Name "MySQL80" -StartupType Automatic -ErrorAction SilentlyContinue

# Step 5: Start service
Write-Host ""
Write-Host "Step 5: Starting MySQL service..." -ForegroundColor Cyan

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
        }
    } else {
        Write-Host "Service status: $($service.Status)" -ForegroundColor Red
        Write-Host ""
        Write-Host "Service failed to start. Check error log:" -ForegroundColor Yellow
        Write-Host "$dataDir\*.err" -ForegroundColor White
    }
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "The service may need to be started manually first." -ForegroundColor Yellow
    Write-Host "Try running: .\start-mysql-now.ps1" -ForegroundColor Cyan
    Write-Host "This will start MySQL manually so you can see the actual error." -ForegroundColor Yellow
}

Pop-Location

Write-Host ""
Write-Host "Fix complete." -ForegroundColor Cyan

