# Start MySQL Manually and Create Config File
# Run as Administrator

Write-Host "Starting MySQL manually to test..." -ForegroundColor Cyan
Write-Host ""

$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin"
$dataDir = "C:\ProgramData\MySQL\MySQL Server 8.0\Data"
$configDir = "C:\ProgramData\MySQL\MySQL Server 8.0"
$configFile = "$configDir\my.ini"

# Create config file if it doesn't exist
if (-not (Test-Path $configFile)) {
    Write-Host "Creating MySQL configuration file..." -ForegroundColor Yellow
    
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
"@
    
    # Ensure config directory exists
    if (-not (Test-Path $configDir)) {
        New-Item -ItemType Directory -Path $configDir -Force | Out-Null
    }
    
    $configContent | Out-File -FilePath $configFile -Encoding ASCII
    Write-Host "Config file created: $configFile" -ForegroundColor Green
}

# Try to start MySQL manually
Write-Host ""
Write-Host "Attempting to start MySQL manually..." -ForegroundColor Cyan
Write-Host "This will run in the foreground - you'll see any errors." -ForegroundColor Yellow
Write-Host "If MySQL starts successfully, you'll see 'ready for connections'" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

Push-Location $mysqlPath

# Start MySQL with config file
if (Test-Path $configFile) {
    Write-Host "Starting with config file: $configFile" -ForegroundColor Cyan
    & .\mysqld.exe --defaults-file=$configFile --console
} else {
    Write-Host "Starting with default settings" -ForegroundColor Cyan
    & .\mysqld.exe --console --datadir=$dataDir
}

Pop-Location

