# PowerShell script to set MySQL root password on Windows
# Run this as Administrator if needed

$mysqlPassword = "ajhsports2024"
$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"

# Check if MySQL is running
Write-Host "Checking if MySQL is running..." -ForegroundColor Yellow
$mysqlService = Get-Service -Name "MySQL80" -ErrorAction SilentlyContinue

if ($mysqlService -and $mysqlService.Status -eq "Running") {
    Write-Host "✅ MySQL is running" -ForegroundColor Green
} else {
    Write-Host "❌ MySQL is not running. Please start MySQL first." -ForegroundColor Red
    Write-Host "   Run: net start MySQL80" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n🔐 Setting MySQL root password to: $mysqlPassword" -ForegroundColor Yellow
Write-Host "⚠️  You may be prompted for your current MySQL root password" -ForegroundColor Yellow
Write-Host "   (If you don't have a password, just press Enter)" -ForegroundColor Yellow
Write-Host ""

# Try to connect and set password
# First, try without password
$sqlCommands = @"
ALTER USER 'root'@'localhost' IDENTIFIED BY '$mysqlPassword';
FLUSH PRIVILEGES;
EXIT;
"@

Write-Host "Attempting to connect to MySQL..." -ForegroundColor Yellow

# Try connecting without password first
$result = echo $sqlCommands | & $mysqlPath -u root 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Password set successfully!" -ForegroundColor Green
    Write-Host "`n📋 MySQL root password is now: $mysqlPassword" -ForegroundColor Green
    Write-Host "`n💡 Your backend/.env file should have: DB_PASS=$mysqlPassword" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ Could not set password automatically." -ForegroundColor Red
    Write-Host "`n💡 Please set it manually:" -ForegroundColor Yellow
    Write-Host "   1. Open Command Prompt or PowerShell" -ForegroundColor White
    Write-Host "   2. Run: `"$mysqlPath`" -u root -p" -ForegroundColor White
    Write-Host "   3. Enter your current password (or press Enter if no password)" -ForegroundColor White
    Write-Host "   4. Run these SQL commands:" -ForegroundColor White
    Write-Host "      ALTER USER 'root'@'localhost' IDENTIFIED BY '$mysqlPassword';" -ForegroundColor Cyan
    Write-Host "      FLUSH PRIVILEGES;" -ForegroundColor Cyan
    Write-Host "      EXIT;" -ForegroundColor Cyan
}

