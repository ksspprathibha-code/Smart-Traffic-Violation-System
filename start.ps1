# TrafficEye Complete Startup Script (PowerShell)
# Starts both backend API server and frontend development server

Clear-Host

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     TRAFFICEYE - SMART VIOLATION ANALYTICS SYSTEM      ║" -ForegroundColor Cyan
Write-Host "║              Complete System Initialization            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check and install backend dependencies
Write-Host "📦 Checking Backend Dependencies..." -ForegroundColor Yellow

if (-not (Test-Path "backend\node_modules")) {
    Write-Host "   Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    Set-Location ..
    Write-Host "   ✅ Backend dependencies installed" -ForegroundColor Green
}

# Start backend server
Write-Host ""
Write-Host "🚀 Starting AI Engine Backend Server..." -ForegroundColor Yellow
$backendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm start" -PassThru
Write-Host "   ✅ Backend server started (PID: $($backendJob.Id))" -ForegroundColor Green

# Wait for backend to be ready
Write-Host ""
Write-Host "⏳ Waiting for AI Engine to be ready (5 seconds)..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

# Start frontend development server
Write-Host ""
Write-Host "🚀 Starting Frontend Development Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║              🎯 SYSTEM INITIALIZATION COMPLETE          ║" -ForegroundColor Green
Write-Host "║                                                        ║" -ForegroundColor Green
Write-Host "║  ✅ AI Engine:   http://localhost:5000                ║" -ForegroundColor Green
Write-Host "║  ✅ Frontend:    http://localhost:3001                ║" -ForegroundColor Green
Write-Host "║                                                        ║" -ForegroundColor Green
Write-Host "║  🔗 Auto-connect enabled                              ║" -ForegroundColor Green
Write-Host "║  💾 CORS configured                                   ║" -ForegroundColor Green
Write-Host "║  🚀 Ready for operations                              ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

# Keep the script running to maintain the background job
Start-Sleep -Seconds 86400
