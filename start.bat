@echo off
REM TrafficEye Complete Startup Script (Windows)
REM Starts both backend API server and frontend development server

setlocal enabledelayedexpansion

cls
echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║     TRAFFICEYE - SMART VIOLATION ANALYTICS SYSTEM      ║
echo ║              Complete System Initialization            ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM Check and install backend dependencies
echo 📦 Checking Backend Dependencies...
if not exist "backend\node_modules" (
    echo    Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

REM Start backend server
echo.
echo 🚀 Starting AI Engine Backend Server...
cd backend
start "TrafficEye AI Engine" cmd /k npm start
cd ..

REM Wait for backend to be ready
echo.
echo ⏳ Waiting for AI Engine to be ready ^(5 seconds^)...
timeout /t 5 /nobreak

REM Start frontend server
echo.
echo 🚀 Starting Frontend Development Server...
start "TrafficEye Frontend" cmd /k npm run dev

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║              🎯 SYSTEM INITIALIZATION COMPLETE          ║
echo ║                                                        ║
echo ║  ✅ AI Engine:   http://localhost:5000                ║
echo ║  ✅ Frontend:    http://localhost:3001                ║
echo ║                                                        ║
echo ║  🔗 Auto-connect enabled                              ║
echo ║  💾 CORS configured                                   ║
echo ║  🚀 Ready for operations                              ║
echo ╚════════════════════════════════════════════════════════╝
echo.
