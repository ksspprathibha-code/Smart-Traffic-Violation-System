#!/bin/bash

# TrafficEye Complete Startup Script
# Starts both backend API server and frontend development server

echo "╔════════════════════════════════════════════════════════╗"
echo "║     TRAFFICEYE - SMART VIOLATION ANALYTICS SYSTEM      ║"
echo "║              Complete System Initialization            ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Check if backend dependencies are installed
echo "📦 Checking Backend Dependencies..."
if [ ! -d "backend/node_modules" ]; then
    echo "   Installing backend dependencies..."
    cd backend
    npm install
    cd ..
fi

# Start backend server in background
echo ""
echo "🚀 Starting AI Engine Backend Server..."
cd backend
npm start &
BACKEND_PID=$!
cd ..
echo "   ✅ Backend server started (PID: $BACKEND_PID)"

# Wait for backend to be ready
echo ""
echo "⏳ Waiting for AI Engine to be ready (5 seconds)..."
sleep 5

# Start frontend development server
echo ""
echo "🚀 Starting Frontend Development Server..."
npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
