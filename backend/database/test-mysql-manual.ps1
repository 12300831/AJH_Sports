# Test MySQL Manual Start to See Errors
# Run as Administrator

Write-Host "Starting MySQL manually to see error messages..." -ForegroundColor Cyan
Write-Host "This will show the actual error preventing MySQL from starting." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop after you see the error." -ForegroundColor Yellow
Write-Host ""

$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin"
$dataDir = "C:\ProgramData\MySQL\MySQL Server 8.0\Data"

Push-Location $mysqlPath

Write-Host "Running: .\mysqld.exe --console --datadir=$dataDir" -ForegroundColor Cyan
Write-Host ""

# Start MySQL in console mode - this will show all errors
& .\mysqld.exe --console --datadir=$dataDir

Pop-Location

