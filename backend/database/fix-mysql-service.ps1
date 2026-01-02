# Fix MySQL Service Startup Issues
# Run this script as Administrator

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MySQL Service Troubleshooting" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    exit 1
}

$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin"
$mysqldPath = Join-Path $mysqlPath "mysqld.exe"
$dataDir = "C:\ProgramData\MySQL\MySQL Server 8.0\Data"
$configFile = "C:\ProgramData\MySQL\MySQL Server 8.0\my.ini"

Write-Host "Checking MySQL installation..." -ForegroundColor Cyan

# Check if MySQL is installed
if (-not (Test-Path $mysqldPath)) {
    Write-Host "ERROR: MySQL not found at: $mysqldPath" -ForegroundColor Red
    exit 1
}

Write-Host "MySQL executable found" -ForegroundColor Green

# Check data directory
if (-not (Test-Path $dataDir)) {
    Write-Host "WARNING: Data directory not found: $dataDir" -ForegroundColor Yellow
    Write-Host "Creating data directory..." -ForegroundColor Cyan
    New-Item -ItemType Directory -Path $dataDir -Force | Out-Null
}

# Check configuration file
if (-not (Test-Path $configFile)) {
    Write-Host "WARNING: Configuration file not found: $configFile" -ForegroundColor Yellow
    Write-Host "MySQL may need to be initialized. Trying to start with default config..." -ForegroundColor Cyan
}

# Try to start MySQL manually to see the actual error
Write-Host ""
Write-Host "Attempting to start MySQL manually to see error messages..." -ForegroundColor Cyan
Write-Host ""

Push-Location $mysqlPath

# Try to initialize data directory if needed
if (-not (Test-Path "$dataDir\mysql")) {
    Write-Host "Initializing MySQL data directory..." -ForegroundColor Cyan
    $initResult = & .\mysqld.exe --initialize-insecure --datadir=$dataDir 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Data directory initialized" -ForegroundColor Green
    } else {
        Write-Host "Note: Data directory may already exist or initialization had issues" -ForegroundColor Yellow
    }
}

# Alternative: Remove and reinstall service
Write-Host ""
Write-Host "Removing existing service..." -ForegroundColor Yellow
& .\mysqld.exe --remove MySQL80 2>&1 | Out-Null
Start-Sleep -Seconds 2

Write-Host "Reinstalling service..." -ForegroundColor Yellow
if (Test-Path $configFile) {
    $installResult = & .\mysqld.exe --install MySQL80 --defaults-file=$configFile 2>&1
} else {
    $installResult = & .\mysqld.exe --install MySQL80 2>&1
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "Service reinstalled successfully" -ForegroundColor Green
    Set-Service -Name "MySQL80" -StartupType Automatic
    
    Write-Host "Starting MySQL service..." -ForegroundColor Cyan
    Start-Service -Name "MySQL80" -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 5
    
    $service = Get-Service -Name "MySQL80" -ErrorAction SilentlyContinue
    if ($service -and $service.Status -eq 'Running') {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "MySQL Service Started Successfully!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Get-Service -Name "MySQL80" | Format-Table Name, Status, StartType -AutoSize
    } else {
        Write-Host ""
        Write-Host "Service installed but failed to start." -ForegroundColor Red
        Write-Host ""
        Write-Host "Checking for error logs..." -ForegroundColor Yellow
        
        # Check for error logs
        $errorLogs = Get-ChildItem "C:\ProgramData\MySQL\MySQL Server 8.0\Data\*.err" -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending
        if ($errorLogs) {
            Write-Host "Latest error log: $($errorLogs[0].FullName)" -ForegroundColor Yellow
            Write-Host "Last 20 lines:" -ForegroundColor Cyan
            Get-Content $errorLogs[0].FullName -Tail 20
        } else {
            Write-Host "No error log found. Checking Windows Event Log..." -ForegroundColor Yellow
            $events = Get-EventLog -LogName Application -Source MySQL* -Newest 5 -ErrorAction SilentlyContinue
            if ($events) {
                $events | Format-List TimeGenerated, Message
            } else {
                Write-Host "No MySQL events found in Event Log." -ForegroundColor Yellow
            }
        }
        
        Write-Host ""
        Write-Host "Troubleshooting steps:" -ForegroundColor Yellow
        Write-Host "1. Check if port 3306 is in use: netstat -ano | findstr :3306" -ForegroundColor White
        Write-Host "2. Verify data directory permissions" -ForegroundColor White
        Write-Host "3. Try starting MySQL manually: cd '$mysqlPath' ; .\mysqld.exe --console" -ForegroundColor White
    }
} else {
    Write-Host "Failed to reinstall service. Error:" -ForegroundColor Red
    Write-Host $installResult -ForegroundColor Red
}

Pop-Location

Write-Host ""
Write-Host "Troubleshooting complete." -ForegroundColor Cyan
