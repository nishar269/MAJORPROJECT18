const API_BASE = 'http://localhost:5000/api';

function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

async function request(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: getHeaders(),
      ...options,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    return data;
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err.message);
    throw err;
  }
}

// ─── AUTH ────────────────────────────────────────
export const authAPI = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name, email, password, role) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    }),
};

// ─── TOURIST ────────────────────────────────────
export const touristAPI = {
  getProfile: () => request('/tourist/profile'),
  getAll: () => request('/tourist/all'),
  updateLocation: (lat, lng) =>
    request('/tourist/location-update', {
      method: 'POST',
      body: JSON.stringify({ lat, lng }),
    }),
  getHeatmap: () => request('/tourist/heatmap'),
};

// ─── ALERTS ─────────────────────────────────────
export const alertsAPI = {
  getAll: (severity) => request(`/alerts${severity ? `?severity=${severity}` : ''}`),
  create: (alert) =>
    request('/alerts', {
      method: 'POST',
      body: JSON.stringify(alert),
    }),
  markRead: (id) =>
    request(`/alerts/${id}/read`, { method: 'PATCH' }),
};

// ─── EMERGENCY ──────────────────────────────────
export const emergencyAPI = {
  panic: (lat, lng) =>
    request('/emergency/panic', {
      method: 'POST',
      body: JSON.stringify({ lat, lng }),
    }),
  cancel: (incidentId) =>
    request('/emergency/cancel', {
      method: 'POST',
      body: JSON.stringify({ incidentId }),
    }),
  getIncidents: () => request('/emergency/incidents'),
};

// ─── GEO-FENCE ──────────────────────────────────
export const geofenceAPI = {
  getZones: () => request('/geofence/zones'),
  checkLocation: (lat, lng) =>
    request('/geofence/check', {
      method: 'POST',
      body: JSON.stringify({ lat, lng }),
    }),
  addZone: (zone) =>
    request('/geofence/zones', {
      method: 'POST',
      body: JSON.stringify(zone),
    }),
};

// ─── BLOCKCHAIN ─────────────────────────────────
export const blockchainAPI = {
  register: (touristId) =>
    request('/blockchain/register', {
      method: 'POST',
      body: JSON.stringify({ touristId }),
    }),
  verify: (touristId) =>
    request('/blockchain/verify', {
      method: 'POST',
      body: JSON.stringify({ touristId }),
    }),
  getChain: () => request('/blockchain/chain'),
};

// ─── AI ─────────────────────────────────────────
export const aiAPI = {
  detect: (data) =>
    request('/ai/detect', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ─── STATUS ─────────────────────────────────────
export const statusAPI = {
  getStatus: () => request('/status'),
};

export default {
  auth: authAPI,
  tourist: touristAPI,
  alerts: alertsAPI,
  emergency: emergencyAPI,
  geofence: geofenceAPI,
  blockchain: blockchainAPI,
  ai: aiAPI,
  status: statusAPI,
};
