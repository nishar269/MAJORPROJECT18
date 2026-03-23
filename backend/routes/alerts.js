const express = require('express');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// In-memory alerts
const alerts = [
  { id: 1, message: 'Tourist entered high-risk zone near Sector 7', severity: 'warning', touristId: 'USR-3421', lat: 28.5968, lng: 77.2254, time: new Date(Date.now() - 2 * 60000), read: false },
  { id: 2, message: 'PANIC button triggered by USR-3892 at Railway Junction', severity: 'critical', touristId: 'USR-3892', lat: 28.6085, lng: 77.2320, time: new Date(Date.now() - 8 * 60000), read: false },
  { id: 3, message: 'Unusual inactivity detected for USR-1034 (AI Engine)', severity: 'info', touristId: 'USR-1034', lat: 28.5968, lng: 77.2254, time: new Date(Date.now() - 15 * 60000), read: true },
  { id: 4, message: 'Geo-fence breach at Heritage Site boundary by USR-5590', severity: 'warning', touristId: 'USR-5590', lat: 28.6250, lng: 77.2010, time: new Date(Date.now() - 22 * 60000), read: true },
  { id: 5, message: 'Tourist USR-8712 left monitored zone', severity: 'warning', touristId: 'USR-8712', lat: 28.6329, lng: 77.2195, time: new Date(Date.now() - 30 * 60000), read: true },
  { id: 6, message: 'PANIC button triggered by USR-1199 near Market District', severity: 'critical', touristId: 'USR-1199', lat: 28.6180, lng: 77.2150, time: new Date(Date.now() - 45 * 60000), read: true },
  { id: 7, message: 'AI detected sudden stop for USR-2041 in low-connectivity area', severity: 'info', touristId: 'USR-2041', lat: 28.5990, lng: 77.2280, time: new Date(Date.now() - 60 * 60000), read: true },
  { id: 8, message: 'System health check passed — all services operational', severity: 'success', touristId: null, lat: null, lng: null, time: new Date(Date.now() - 120 * 60000), read: true },
];

// GET /api/alerts
router.get('/', authMiddleware, (req, res) => {
  const { severity } = req.query;
  let filtered = alerts;
  if (severity && severity !== 'all') {
    filtered = alerts.filter(a => a.severity === severity);
  }
  res.json(filtered);
});

// POST /api/alerts (create new alert)
router.post('/', authMiddleware, (req, res) => {
  const { message, severity, touristId, lat, lng } = req.body;
  const newAlert = {
    id: alerts.length + 1,
    message,
    severity: severity || 'info',
    touristId,
    lat,
    lng,
    time: new Date(),
    read: false,
  };
  alerts.unshift(newAlert);

  // Broadcast via socket
  if (req.io) {
    req.io.emit('new-alert', newAlert);
  }

  res.status(201).json(newAlert);
});

// PATCH /api/alerts/:id/read
router.patch('/:id/read', authMiddleware, (req, res) => {
  const alert = alerts.find(a => a.id === parseInt(req.params.id));
  if (!alert) return res.status(404).json({ error: 'Alert not found' });
  alert.read = true;
  res.json(alert);
});

module.exports = router;
