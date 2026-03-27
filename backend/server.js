import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = 5000;

/* ✅ FIXED CORS (important for Vite 5173) */
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

app.use(bodyParser.json({ limit: '50mb' }));

/* ✅ 🔥 NEW STATUS API (THIS FIXES ENGINE OFFLINE) */
app.get('/status', (req, res) => {
  res.json({
    status: 'online',
    engine: 'AI_ENGINE_ACTIVE'
  });
});

/* EXISTING HEALTH API */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    engine: 'AI_ENGINE_ACTIVE'
  });
});

/* VIDEO FRAME API (SIMULATION) */
app.post('/api/analyze/video-frame', (req, res) => {

  const vehicles = [
    {
      id: "V001",
      type: "Car",
      speed_estimated_kmph: 45,
      bbox: [0.2, 0.3, 0.5, 0.6],
      status: "normal"
    }
  ];

  res.json({
    success: true,
    data: {
      vehicles,
      collision_detected: false,
      alert_level: "LOW"
    }
  });
});

/* START SERVER */
app.listen(PORT, () => {
  console.log("🚀 AI ENGINE RUNNING ON http://localhost:5000");
});

export default app;