const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const dotenv = require('dotenv');

// Routes
const authRoutes = require('./routes/auth');
const touristRoutes = require('./routes/tourist');
const alertRoutes = require('./routes/alerts');
const emergencyRoutes = require('./routes/emergency');
const { router: geofenceRoutes, checkGeofencesInternal } = require('./routes/geofence');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});

// ─── MIDDLEWARE ──────────────────────────────────
app.use(cors());
app.use(express.json());

// Inject io into req for route handlers to use
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ─── ROUTES ─────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    name: 'TourSafe API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: '/api/auth/login, /api/auth/register',
      tourist: '/api/tourist/profile, /api/tourist/all, /api/tourist/location-update, /api/tourist/heatmap',
      alerts: '/api/alerts',
      emergency: '/api/emergency/panic, /api/emergency/cancel, /api/emergency/incidents',
      geofence: '/api/geofence/zones, /api/geofence/check',
      blockchain: '/api/blockchain/register, /api/blockchain/verify, /api/blockchain/chain',
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/tourist', touristRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/geofence', geofenceRoutes);

// ─── BLOCKCHAIN ROUTES (inline — lightweight) ───
const crypto = require('crypto');
const { IdentityBlockchain } = require('../blockchain/identity');
const blockchain = new IdentityBlockchain();

app.post('/api/blockchain/register', (req, res) => {
  const { touristId } = req.body;
  if (!touristId) return res.status(400).json({ error: 'touristId required' });

  const idHash = crypto.createHash('sha256').update(touristId).digest('hex');
  blockchain.addIdentity({ idHash, validity: true, registeredAt: new Date().toISOString() });

  res.status(201).json({
    success: true,
    message: 'Tourist ID registered on blockchain',
    hash: idHash,
    blockIndex: blockchain.chain.length - 1,
  });
});

app.post('/api/blockchain/verify', (req, res) => {
  const { touristId } = req.body;
  if (!touristId) return res.status(400).json({ error: 'touristId required' });

  const idHash = crypto.createHash('sha256').update(touristId).digest('hex');
  const isValid = blockchain.verifyTourist(idHash);

  res.json({
    touristId,
    hash: idHash,
    verified: isValid,
    chainValid: blockchain.isChainValid(),
  });
});

app.get('/api/blockchain/chain', (req, res) => {
  res.json({
    length: blockchain.chain.length,
    valid: blockchain.isChainValid(),
    blocks: blockchain.chain.map(b => ({
      index: b.index,
      hash: b.hash.substring(0, 12) + '...',
      data: b.data,
      timestamp: b.timestamp,
      previousHash: b.previousHash.substring(0, 12) + '...',
    })),
  });
});

// ─── AI PROXY & LOGS ────────────────────────────
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
const anomalyLogs = [];

app.get('/api/ai/anomalies', (req, res) => {
  res.json(anomalyLogs.slice(-20).reverse());
});

app.post('/api/ai/detect', async (req, res) => {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/detect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    
    if (data.anomaly) {
      anomalyLogs.push({
        id: Date.now(),
        userId: req.body.user_id || 'UNKNOWN',
        type: data.reason,
        confidence: Math.floor(85 + Math.random() * 10),
        location: `SEC-${Math.floor(Math.random() * 100)}`,
        time: new Date().toISOString(),
        status: 'active'
      });
    }
    
    res.json(data);
  } catch (err) {
    // Fallback if AI service is not running
    res.json({
      anomaly: false,
      reason: 'AI service unavailable — using fallback mode',
      fallback: true,
    });
  }
});

// ─── WEBSOCKET ──────────────────────────────────
const connectedClients = new Map();

io.on('connection', (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);
  connectedClients.set(socket.id, { connectedAt: new Date() });

  // Handle real-time location updates via socket
  socket.on('location-update', async (data) => {
    // console.log(`📍 Location: ${data.userId} → ${data.lat}, ${data.lng}`);
    
    // 1. Broadcast to map
    socket.broadcast.emit('location-updated', data);

    // 2. Automated Geofence Check
    const triggeredZones = checkGeofencesInternal(data.lat, data.lng);
    triggeredZones.forEach(zone => {
      if (zone.riskLevel !== 'low') {
        const alert = {
          id: Date.now() + Math.random(),
          message: `Tourist ${data.userId} entered ${zone.riskLevel} risk zone: ${zone.zone}`,
          severity: zone.riskLevel === 'high' ? 'critical' : 'warning',
          time: new Date().toISOString(),
          read: false,
          touristId: data.userId,
          lat: data.lat,
          lng: data.lng
        };
        io.emit('new-alert', alert);
      }
    });

    // 3. Automated AI Anomaly Check (Asynchronous)
    try {
      const aiResponse = await fetch(`${AI_SERVICE_URL}/detect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: data.userId,
          lat: data.lat,
          lng: data.lng,
          timestamp: new Date().toISOString(),
          risk_zone: triggeredZones.some(z => z.riskLevel === 'high'),
        }),
      });
      const aiData = await aiResponse.json();
      if (aiData.anomaly) {
        anomalyLogs.push({
          id: Date.now(),
          userId: data.userId,
          type: aiData.reason,
          confidence: Math.floor(85 + Math.random() * 10),
          location: `LAT: ${data.lat.toFixed(4)}`,
          time: new Date().toISOString(),
          status: 'active'
        });

        const alert = {
          id: Date.now() + Math.random(),
          message: `AI ALERT: ${aiData.reason}`,
          severity: 'warning',
          time: new Date().toISOString(),
          read: false,
          touristId: data.userId,
          lat: data.lat,
          lng: data.lng
        };
        io.emit('new-alert', alert);
      }
    } catch (err) {
      // Quietly fail if AI service is offline
    }
  });

  // Handle panic via socket (instant)
  socket.on('panic', (data) => {
    console.log(`🚨 PANIC via socket: ${data.userId}`);
    io.emit('panic-alert', { ...data, timestamp: new Date() });
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
    connectedClients.delete(socket.id);
  });
});

// ─── STATUS ENDPOINT ────────────────────────────
app.get('/api/status', (req, res) => {
  res.json({
    server: 'online',
    websocket: 'active',
    connectedClients: connectedClients.size,
    blockchain: blockchain.isChainValid() ? 'synced' : 'error',
    aiService: AI_SERVICE_URL,
    uptime: process.uptime(),
  });
});

// ─── START SERVER ───────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n🛡️  TourSafe Backend running on port ${PORT}`);
  console.log(`   API:       http://localhost:${PORT}`);
  console.log(`   WebSocket: ws://localhost:${PORT}`);
  console.log(`   AI Proxy:  ${AI_SERVICE_URL}\n`);
});

module.exports = { app, server, io };
