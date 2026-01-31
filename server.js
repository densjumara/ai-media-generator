import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import compression from 'compression';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import photoRoutes from './routes/photoRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import aiAnalysisRoutes from './routes/aiAnalysisRoutes.js';
import statusRoutes from './routes/statusRoutes.js';
import authRoutes from './auth/authRoutes.js';
import { authenticateToken } from './auth/jwtMiddleware.js';
import paymentRoutes from './routes/paymentRoutes.js';
import trialRoutes from './routes/trialRoutes.js';
import aiChatRoutes from './routes/aiChatRoutes.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Authentication Routes (public)
app.use('/api/auth', authRoutes);

// API Routes (protected with optional auth)
app.use('/api/photo', photoRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/analysis', aiAnalysisRoutes);
app.use('/api/status', statusRoutes);
// Payment API
app.use('/api/payment', paymentRoutes);
// Trial API
app.use('/api/trial', trialRoutes);
// AI Chat ideas
app.use('/api/ai', aiChatRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path
    "scripts": {
  "start": "node server.js",
  "dev": "node server.js"
}

  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 AI Media Generator Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ API Health: http://localhost:${PORT}/api/health`);
});
app.get('/api/health', (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date()
  });
});


export default app;
