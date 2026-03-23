const express = require('express');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// In-memory incidents
const incidents = [];

// POST /api/emergency/panic
router.post('/panic', authMiddleware, (req, res) => {
  const { lat, lng } = req.body;
  const userId = req.user.id;
  const userName = req.user.name;

  const incident = {
    id: incidents.length + 1,
    type: 'PANIC',
    userId,
    userName,
    lat: lat || 28.6139,
    lng: lng || 77.2090,
    timestamp: new Date(),
    status: 'active',
    respondingUnit: null,
    estimatedETA: '~3 min',
  };

  incidents.push(incident);

  // Broadcast panic to all connected clients (police dashboard)
  if (req.io) {
    req.io.emit('panic-alert', incident);
  }

  console.log(`🚨 PANIC Button triggered by ${userName} (${userId}) at ${lat}, ${lng}`);

  res.status(200).json({
    success: true,
    message: 'Emergency services have been notified',
    incident,
  });
});

// POST /api/emergency/cancel
router.post('/cancel', authMiddleware, (req, res) => {
  const { incidentId } = req.body;
  const incident = incidents.find(i => i.id === incidentId);
  
  if (incident) {
    incident.status = 'cancelled';
    if (req.io) {
      req.io.emit('panic-cancelled', { incidentId, userId: req.user.id });
    }
  }

  res.json({ success: true, message: 'Emergency cancelled' });
});

// GET /api/emergency/incidents
router.get('/incidents', authMiddleware, (req, res) => {
  res.json(incidents);
});

module.exports = router;
