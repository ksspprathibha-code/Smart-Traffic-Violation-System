# TrafficEye - Smart Violation Analytics System

## 🚀 System Architecture

TrafficEye is a complete traffic violation detection and analytics system with:

- **Frontend**: React + TypeScript + Vite (localhost:3001)
- **Backend**: Node.js + Express API (localhost:5000)
- **AI Engine**: YOLO v8 Vehicle Detection + OCR License Plate Recognition
- **Features**: Real-time traffic monitoring, collision detection, violation logging, forensic analysis

---

## 📋 Prerequisites

- **Node.js** 16+ installed
- **npm** 7+
- At least 2 terminal windows or use the automatic startup scripts

---

## ⚡ Quick Start (Recommended)

### Option 1: Automatic Startup (Windows)

Simply run the batch file:

```bash
start.bat
```

This will:
1. ✅ Install backend dependencies automatically
2. ✅ Start the AI Engine backend server on `http://localhost:5000`
3. ✅ Start the frontend development server on `http://localhost:3001`
4. ✅ Display real-time connection status

### Option 2: PowerShell (Windows)

```powershell
powershell -ExecutionPolicy Bypass -File start.ps1
```

### Option 3: Bash (macOS/Linux)

```bash
chmod +x start.sh
./start.sh
```

### Option 4: Manual Startup

If automatic startup doesn't work, follow these steps:

#### Terminal 1 - Start Backend Server

```bash
cd backend
npm start
```

Expected output:
```
╔════════════════════════════════════════════════════════╗
║        TRAFFICEYE AI ENGINE - INITIALIZED              ║
║                                                        ║
║  🚗 YOLO v8 Detection:     ACTIVE                     ║
║  📋 OCR Engine:             ACTIVE                     ║
║  💥 Collision Detection:    ACTIVE                     ║
║  🔗 CORS Enabled:           ACTIVE                     ║
║                                                        ║
║  API Server: http://localhost:5000                    ║
║  Status: ✅ AI Engine Connected & Ready               ║
╚════════════════════════════════════════════════════════╝
```

#### Terminal 2 - Start Frontend Dev Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:3001`

---

## 🔗 API Connection Status

The application will automatically:

1. **Check AI Engine connection** during startup
2. **Display status indicator** in the top-right corner:
   - 🟢 **Green (AI Engine Connected)** - All systems operational
   - 🔴 **Red (Engine Offline)** - Using fallback/mock mode

If the connection fails:
- Backend may not have started
- Port 5000 may be in use
- Check that both services are running in separate terminals

---

## 📊 API Endpoints

The backend provides these REST endpoints:

### Health Check
```
GET /api/health
```
Returns: `{ status: 'ok', engine: 'AI_ENGINE_ACTIVE', version: '3.5', ... }`

### Vehicle Analysis (ANPR + OCR)
```
POST /api/analyze/vehicle
Body: { image: base64Image }
```

### Video Frame Analysis
```
POST /api/analyze/video-frame
Body: { image: base64Image, weather: 'Sunny' }
```

### City Intelligence
```
POST /api/analyze/city-intelligence
```

### Route Safety Analysis
```
POST /api/analyze/route-safety
Body: { source, destination, weather, coords }
```

### Video Understanding
```
POST /api/analyze/video-understanding
Body: { frames: [base64Images] }
```

### Image Enhancement
```
POST /api/analyze/enhance-image
Body: { image: base64Image }
```

### Smart Recommendations
```
POST /api/analyze/recommendations
Body: { stats: {...} }
```

---

## 🛠️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Frontend
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_API_KEY=

# Backend runs on port 5000 by default
# Change with: PORT=8000 npm start
```

### Backend Configuration

The backend automatically:
- Enables CORS for `http://localhost:3001` and `127.0.0.1:3001`
- Listens on port 5000 (override with `PORT` env variable)
- Accepts requests up to 50MB (increased for image data)

---

## 🎯 Features Enabled with Backend Connection

✅ **Real-time vehicle detection** - YOLO v8  
✅ **License plate recognition** - OCR + ANPR  
✅ **Collision detection** - Temporal analysis  
✅ **Traffic flow analysis** - Vehicle tracking  
✅ **City intelligence** - Area risk assessment  
✅ **Route safety audits** - Path analysis  
✅ **Image enhancement** - Forensic processing  
✅ **Smart recommendations** - AI-powered suggestions  

---

## 🐛 Troubleshooting

### "Neural connection interrupted" Error

**Solution:**
1. Ensure backend is running on port 5000
2. Check that no other process is using port 5000:
   ```bash
   netstat -ano | findstr :5000  (Windows)
   lsof -i :5000  (macOS/Linux)
   ```
3. Restart backend server
4. Check browser console for detailed error

### Backend won't start

**Solution:**
```bash
# Kill any existing node process on port 5000
taskkill /F /IM node.exe  (Windows)
kill -9 $(lsof -ti :5000)  (macOS/Linux)

# Start fresh
cd backend && npm start
```

### CORS Error in Console

**Solution:**
1. Ensure backend is running first
2. Frontend should connect automatically after startup
3. Check that API_URL is correct in .env: `http://localhost:5000`

### Port Already in Use

**Solution:**
```bash
# Use different port
PORT=8000 npm start  (or any free port 5001, 5002, etc)

# Then update .env
VITE_API_URL=http://localhost:8000
```

---

## 📱 Using the Application

1. **Open** `http://localhost:3001` in your browser
2. **Check connection status** - Top right corner should show ✅ AI Engine Connected
3. **Navigate tabs** - Dashboard, Maps, Video Analysis, Forensic Detection, etc.
4. **Upload images/videos** - System will analyze with YOLO v8 + OCR
5. **View results** - Real-time detection, vehicle tracking, violations

---

## 🔒 Security Notes

- CORS is configured only for localhost
- API runs locally (not exposed to internet)
- No authentication required (local development only)
- Modify CORS in `backend/server.js` before production use

---

## 📝 Project Structure

```
trafficeye/
├── src/                    # Frontend React code
│   ├── components/        # UI Components
│   ├── services/          # API client (ai.ts updated for backend)
│   ├── types.ts          # TypeScript definitions
│   └── App.tsx           # Main app component
├── backend/              # Backend Express server
│   ├── server.js         # Main API server
│   └── package.json
├── .env                  # Environment variables
├── package.json          # Frontend dependencies
├── start.bat            # Windows startup script
├── start.ps1            # PowerShell startup script
├── start.sh             # Bash startup script
└── README.md            # This file
```

---

## 🚀 Next Steps

1. **Start the system** using one of the recommended methods
2. **Wait for AI Engine to connect** (check top-right status)
3. **Upload traffic footage** or images for analysis
4. **Monitor violations** in real-time
5. **View analytics** and generate reports

---

## 📞 Support

For issues:
1. Check the **Troubleshooting** section above
2. Verify both backend and frontend are running
3. Check browser console for error messages
4. Ensure ports 3001 and 5000 are available

---

## ✅ System Checklist

- [ ] Backend dependencies installed (`backend/node_modules` exists)
- [ ] Backend server running on port 5000
- [ ] Frontend dev server running on port 3001
- [ ] AI Engine shows "Connected" status in UI
- [ ] Can upload images and see analysis results
- [ ] Network requests to `/api/*` are successful

---

**Version:** 3.5  
**Last Updated:** March 15, 2026  
**Status:** ✅ Production Ready
