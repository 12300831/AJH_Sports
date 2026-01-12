# Verify all files needed for deployment
Write-Host "`n🔍 Backend Deployment Verification" -ForegroundColor Cyan
Write-Host ("=" * 50) -ForegroundColor Gray

$allGood = $true

# Core files
Write-Host "`n📁 Core Files:" -ForegroundColor Yellow
$coreFiles = @(
    "server.js",
    "package.json",
    ".deployment",
    "startup.sh"
)
foreach ($file in $coreFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file MISSING" -ForegroundColor Red
        $allGood = $false
    }
}

# Config files
Write-Host "`n⚙️  Configuration Files:" -ForegroundColor Yellow
$configFiles = @(
    "config\db.js",
    "config\passport.js",
    "config\stripe.js"
)
foreach ($file in $configFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  $file (optional)" -ForegroundColor Yellow
    }
}

# Route files
Write-Host "`n🛣️  Route Files:" -ForegroundColor Yellow
$routeFiles = @(
    "routes\setupRoutes.js",
    "routes\authRoutes.js",
    "routes\oauthRoutes.js",
    "routes\paymentRoutes.js",
    "routes\userRoutes.js",
    "routes\eventRoutes.js",
    "routes\coachRoutes.js",
    "routes\bookingPaymentRoutes.js",
    "routes\healthRoutes.js",
    "routes\contactRoutes.js"
)
foreach ($file in $routeFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file MISSING" -ForegroundColor Red
        $allGood = $false
    }
}

# Middleware files
Write-Host "`n🔧 Middleware Files:" -ForegroundColor Yellow
$middlewareFiles = @(
    "middleware\logger.js",
    "middleware\notFound.js",
    "middleware\errorHandler.js",
    "middleware\auth.js"
)
foreach ($file in $middlewareFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file MISSING" -ForegroundColor Red
        $allGood = $false
    }
}

# Summary
Write-Host "`n$(("=" * 50))" -ForegroundColor Gray
if ($allGood) {
    Write-Host "✅ All critical files present! Ready to deploy." -ForegroundColor Green
    Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
    Write-Host "  1. Open backend folder in VS Code" -ForegroundColor White
    Write-Host "  2. Azure panel → Right-click ajh-sports-backend → Deploy" -ForegroundColor White
    Write-Host "  3. After deployment, call POST /api/setup to initialize database" -ForegroundColor White
} else {
    Write-Host "❌ Some critical files are missing!" -ForegroundColor Red
    Write-Host "Please fix missing files before deploying." -ForegroundColor Yellow
}
