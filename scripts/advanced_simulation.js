const axios = require('axios');

const API_URL = "http://localhost:5000/api";

const MOCK_TOURISTS = [
    { id: "USR-001", name: "Alpha", lat: 28.6139, lng: 77.2090, heading: Math.random() * 2 * Math.PI, state: 'normal' },
    { id: "USR-002", name: "Beta", lat: 28.6150, lng: 77.2100, heading: Math.random() * 2 * Math.PI, state: 'normal' },
    { id: "USR-3421", name: "Alice J.", lat: 28.6139, lng: 77.2090, heading: Math.random() * 2 * Math.PI, state: 'normal' },
    { id: "USR-8712", name: "Bob S.", lat: 28.6329, lng: 77.2195, heading: Math.random() * 2 * Math.PI, state: 'normal' },
    { id: "USR-1034", name: "Charlie L.", lat: 28.5968, lng: 77.2254, heading: Math.random() * 2 * Math.PI, state: 'normal' }
];

console.log("🚀 TourSafe Advanced Simulation Engine...");

async function updatePositions() {
    process.stdout.write(".");
    for (const t of MOCK_TOURISTS) {
        // 1. Determine local behavior
        let speed = 0.0004;
        let jitter = 0.4;

        // Chance to enter anomaly state
        if (Math.random() < 0.02 && t.state === 'normal') {
            t.state = 'anomalous';
            console.log(`\n⚠️ ANOMALY: ${t.name} is moving erratically!`);
        }

        if (t.state === 'anomalous') {
            speed = 0.002; // Faster
            jitter = 1.8;  // More erratic
            if (Math.random() < 0.1) t.state = 'normal';
        }

        // 2. Perform Movement
        t.heading += (Math.random() - 0.5) * jitter;
        t.lat += Math.cos(t.heading) * speed;
        t.lng += Math.sin(t.heading) * speed;

        // 3. Keep within Delhi Center (Demo bounds)
        if (Math.abs(t.lat - 28.6139) > 0.08) t.lat = 28.6139;
        if (Math.abs(t.lng - 77.2090) > 0.08) t.lng = 77.2090;

        // 4. Send Update
        try {
            await axios.post(`${API_URL}/tourist/location-update`, {
                userId: t.id,
                lat: t.lat,
                lng: t.lng
            }, { timeout: 1000 }).catch(() => {});

            // Trigger random panic for demo every 50 loops
            if (Math.random() < 0.005) {
                console.log(`\n🚨 PANIC TRIGGERED for ${t.name}`);
                await axios.post(`${API_URL}/emergency/panic`, {
                    userId: t.id,
                    lat: t.lat,
                    lng: t.lng
                }).catch(() => {});
            }

        } catch (e) {
            // Silently fail if backend is down
        }
    }
}

console.log(`👣 Tracking ${MOCK_TOURISTS.length} tourists with dynamic behavior...`);
setInterval(updatePositions, 4000);
updatePositions();
