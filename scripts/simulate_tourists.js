const axios = require('axios');
const http = require('http');

const API_URL = "http://localhost:5000/api";
const SOCKET_URL = "http://localhost:5000";

const MOCK_TOURISTS = [
    { id: "SIM-001", name: "Alpha", lat: 28.6139, lng: 77.2090, heading: Math.random() * 2 * Math.PI },
    { id: "SIM-002", name: "Beta", lat: 28.6150, lng: 77.2100, heading: Math.random() * 2 * Math.PI },
    { id: "SIM-003", name: "Gamma", lat: 28.6200, lng: 77.2000, heading: Math.random() * 2 * Math.PI },
    { id: "SIM-004", name: "Delta", lat: 28.6000, lng: 77.2200, heading: Math.random() * 2 * Math.PI },
    { id: "SIM-005", name: "Epsilon", lat: 28.5900, lng: 77.2250, heading: Math.random() * 2 * Math.PI }
];

console.log("🚀 Node.js Simulation Engine Initializing...");
console.log(`📡 Targeting Backend: ${API_URL}`);

async function updatePositions() {
    process.stdout.write(".");
    for (const t of MOCK_TOURISTS) {
        // Simple random walk
        const speed = 0.0004;
        t.heading += (Math.random() - 0.5) * 0.4;
        t.lat += Math.cos(t.heading) * speed;
        t.lng += Math.sin(t.heading) * speed;

        try {
            // Self-correction for simulation limits (keep in Delhi)
            if (Math.abs(t.lat - 28.6139) > 0.05) t.lat = 28.6139;
            if (Math.abs(t.lng - 77.2090) > 0.05) t.lng = 77.2090;

            await axios.post(`${API_URL}/tourist/location-update`, {
                userId: t.id,
                lat: t.lat,
                lng: t.lng
            }, { timeout: 2000 }).catch(() => {});
        } catch (e) {
            // Silently skip if backend is down
        }
    }
}

console.log(`👣 Tracking ${MOCK_TOURISTS.length} mock tourists... (Press Ctrl+C to stop)`);
setInterval(updatePositions, 5000);
updatePositions();
