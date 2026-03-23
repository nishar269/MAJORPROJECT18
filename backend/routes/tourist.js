const express = require('express');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// In-memory tourist data (replace with DB in production)
const tourists = [
  { id: 1, userId: 'USR-3421', name: 'Alice Johnson', lat: 28.6139, lng: 77.2090, status: 'safe', zone: 'Heritage Zone', lastUpdate: new Date() },
  { id: 2, userId: 'USR-8712', name: 'Bob Smith', lat: 28.6329, lng: 77.2195, status: 'warning', zone: 'Market District', lastUpdate: new Date() },
  { id: 3, userId: 'USR-1034', name: 'Charlie Lee', lat: 28.5968, lng: 77.2254, status: 'danger', zone: 'Sector 7 North', lastUpdate: new Date() },
  { id: 4, userId: 'USR-5590', name: 'Diana Chen', lat: 28.6250, lng: 77.2010, status: 'safe', zone: 'Heritage Zone', lastUpdate: new Date() },
  { id: 5, userId: 'USR-7723', name: 'Ethan Kumar', lat: 28.6085, lng: 77.2320, status: 'safe', zone: 'Railway Junction', lastUpdate: new Date() },
  { id: 6, userId: 'USR-1199', name: 'Fatima Ali', lat: 28.6180, lng: 77.2150, status: 'warning', zone: 'Market District', lastUpdate: new Date() },
  { id: 7, userId: 'USR-2041', name: 'George Tran', lat: 28.5990, lng: 77.2280, status: 'danger', zone: 'Sector 7 North', lastUpdate: new Date() },
];

// Location history for AI
const locationHistory = {};

// GET /api/tourist/profile
router.get('/profile', authMiddleware, (req, res) => {
  const tourist = tourists.find(t => t.id === req.user.id) || tourists[0];
  res.json(tourist);
});

// GET /api/tourist/all
router.get('/all', authMiddleware, (req, res) => {
  res.json(tourists);
});

// POST /api/tourist/location-update
router.post('/location-update', authMiddleware, (req, res) => {
  const { lat, lng } = req.body;
  const userId = req.user.id;

  // Track location history
  if (!locationHistory[userId]) locationHistory[userId] = [];
  locationHistory[userId].push({ lat, lng, timestamp: new Date() });

  // Keep last 100 locations
  if (locationHistory[userId].length > 100) {
    locationHistory[userId] = locationHistory[userId].slice(-100);
  }

  // Update tourist position
  const tourist = tourists.find(t => t.id === userId);
  if (tourist) {
    tourist.lat = lat;
    tourist.lng = lng;
    tourist.lastUpdate = new Date();
  }

  // Emit via socket (will be called from server.js)
  if (req.io) {
    req.io.emit('location-updated', { userId, lat, lng, timestamp: new Date() });
  }

  res.json({ success: true, message: 'Location updated' });
});

// GET /api/tourist/heatmap
router.get('/heatmap', authMiddleware, (req, res) => {
  const heatmapData = tourists.map(t => ({
    lat: t.lat,
    lng: t.lng,
    weight: t.status === 'danger' ? 3 : t.status === 'warning' ? 2 : 1,
  }));
  res.json(heatmapData);
});

module.exports = router;
