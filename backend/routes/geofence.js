const express = require('express');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Geo-fence zones
const zones = [
  { id: 1, name: 'Heritage Zone', lat: 28.6139, lng: 77.2090, radius: 500, riskLevel: 'low', description: 'Historical monuments area' },
  { id: 2, name: 'Market District', lat: 28.6329, lng: 77.2195, radius: 400, riskLevel: 'medium', description: 'Busy commercial zone' },
  { id: 3, name: 'Sector 7 North', lat: 28.5968, lng: 77.2254, radius: 300, riskLevel: 'high', description: 'Known high-risk area' },
  { id: 4, name: 'Railway Junction', lat: 28.6085, lng: 77.2320, radius: 350, riskLevel: 'medium', description: 'Transit hub with moderate risk' },
  { id: 5, name: 'Tourist Beach Area', lat: 28.6200, lng: 77.2400, radius: 600, riskLevel: 'low', description: 'Popular tourist beach' },
];

// Haversine formula for distance between two points
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat * Math.PI / 180 / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon * Math.PI / 180 / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function checkGeofencesInternal(lat, lng) {
  const results = [];
  for (const zone of zones) {
    const distance = haversineDistance(lat, lng, zone.lat, zone.lng);
    const inside = distance <= zone.radius;
    if (inside) {
        results.push({ zone: zone.name, riskLevel: zone.riskLevel });
    }
  }
  return results;
}

// GET /api/geofence/zones
router.get('/zones', authMiddleware, (req, res) => {
  res.json(zones);
});

// POST /api/geofence/check
router.post('/check', authMiddleware, (req, res) => {
  const { lat, lng } = req.body;
  const results = [];

  for (const zone of zones) {
    const distance = haversineDistance(lat, lng, zone.lat, zone.lng);
    const inside = distance <= zone.radius;

    results.push({
      zone: zone.name,
      riskLevel: zone.riskLevel,
      distance: Math.round(distance),
      inside,
      alert: inside && zone.riskLevel !== 'low',
    });
  }

  const triggered = results.filter(r => r.alert);

  res.json({
    location: { lat, lng },
    zones: results,
    alertTriggered: triggered.length > 0,
    triggeredZones: triggered,
  });
});

// POST /api/geofence/zones (add new zone)
router.post('/zones', authMiddleware, (req, res) => {
  const { name, lat, lng, radius, riskLevel, description } = req.body;
  const newZone = {
    id: zones.length + 1,
    name,
    lat,
    lng,
    radius: radius || 300,
    riskLevel: riskLevel || 'medium',
    description: description || '',
  };
  zones.push(newZone);
  res.status(201).json(newZone);
});

module.exports = {
  router,
  checkGeofencesInternal,
  haversineDistance
};
