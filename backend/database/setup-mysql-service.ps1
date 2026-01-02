# MySQL Service Setup Script for Production
# Run this script as Administrator
# Right-click PowerShell and select "Run as Administrator"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MySQL Service Setup for Production" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin"
$mysqldPath = Join-Path $mysqlPath "mysqld.exe"

# Check if MySQL is installed
if (-not (Test-Path $mysqldPath)) {
    Write-Host "ERROR: MySQL not found at: $mysqldPath" -ForegroundColor Red
    Write-Host "Please install MySQL Server 8.0 first." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

Write-Host "MySQL found at: $mysqldPath" -ForegroundColor Green
Write-Host ""

# Check if service already exists
$existingService = Get-Service -Name "MySQL80" -ErrorAction SilentlyContinue

if ($existingService) {
    Write-Host "MySQL service 'MySQL80' already exists." -ForegroundColor Yellow
    
    if ($existingService.Status -eq 'Running') {
        Write-Host "Service is already running!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Service Status:" -ForegroundColor Cyan
        Get-Service -Name "MySQL80" | Format-Table Name, Status, StartType, DisplayName -AutoSize
        exit 0
    } else {
        Write-Host "Service exists but is not running. Starting service..." -ForegroundColor Yellow
        Start-Service -Name "MySQL80"
        Start-Sleep -Seconds 3
        
        if ((Get-Service -Name "MySQL80").Status -eq 'Running') {
            Write-Host "Service started successfully!" -ForegroundColor Green
        } else {
            Write-Host "Failed to start service. Please check MySQL configuration." -ForegroundColor Red
        }
        exit 0
    }
}

# Install MySQL as a Windows service
Write-Host "Installing MySQL as Windows service..." -ForegroundColor Cyan
Write-Host ""

try {
    # Change to MySQL bin directory
    Push-Location $mysqlPath
    
    # Install service with auto-start
    $result = & .\mysqld.exe --install MySQL80 --defaults-file="C:\ProgramData\MySQL\MySQL Server 8.0\my.ini"
    
    if ($LASTEXITCODE -ne 0) {
        # Try without defaults file
        Write-Host "Trying alternative installation method..." -ForegroundColor Yellow
        $result = & .\mysqld.exe --install MySQL80
    }
    
    Pop-Location
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "MySQL service installed successfully!" -ForegroundColor Green
        Write-Host ""
        
        # Set service to auto-start
        Write-Host "Configuring service to start automatically..." -ForegroundColor Cyan
        Set-Service -Name "MySQL80" -StartupType Automatic
        
        # Start the service
        Write-Host "Starting MySQL service..." -ForegroundColor Cyan
        Start-Service -Name "MySQL80"
        Start-Sleep -Seconds 5
        
        # Verify service is running
        $service = Get-Service -Name "MySQL80"
        if ($service.Status -eq 'Running') {
            Write-Host ""
            Write-Host "========================================" -ForegroundColor Green
            Write-Host "MySQL Service Setup Complete!" -ForegroundColor Green
            Write-Host "========================================" -ForegroundColor Green
            Write-Host ""
            Write-Host "Service Status:" -ForegroundColor Cyan
            Get-Service -Name "MySQL80" | Format-Table Name, Status, StartType, DisplayName -AutoSize
            Write-Host ""
            Write-Host "MySQL is now running and will start automatically on boot." -ForegroundColor Green
            Write-Host ""
            Write-Host "You can now run: cd backend && npm run db:setup" -ForegroundColor Yellow
        } else {
            Write-Host "Service installed but failed to start." -ForegroundColor Red
            Write-Host "Please check MySQL configuration and logs." -ForegroundColor Yellow
        }
    } else {
        Write-Host "Failed to install MySQL service." -ForegroundColor Red
        Write-Host "Error: $result" -ForegroundColor Red
    }
} catch {
    Write-Host "Error installing MySQL service: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

