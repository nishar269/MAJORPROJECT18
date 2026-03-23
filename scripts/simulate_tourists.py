import requests
import time
import random
import math
import sys

# Configuration
API_URL = "http://localhost:5000/api"
CENTRAL_LAT = 28.6139
CENTRAL_LNG = 77.2090
DANGER_LAT = 28.5968
DANGER_LNG = 77.2254

# Mock Tourists with explicit float values to avoid type errors
MOCK_TOURISTS = [
    {"id": "USR-1001", "name": "Alpha One", "lat": 28.6139, "lng": 77.2090, "heading": 0.0},
    {"id": "USR-1002", "name": "Beta Two", "lat": 28.6150, "lng": 77.2100, "heading": 1.5},
    {"id": "USR-1003", "name": "Gamma Three", "lat": 28.6200, "lng": 77.2000, "heading": 3.1},
    {"id": "USR-1004", "name": "Delta Four", "lat": 28.6000, "lng": 77.2200, "heading": 4.7},
    {"id": "USR-1005", "name": "Epsilon Five", "lat": 28.5900, "lng": 77.2250, "heading": 6.2}
]

print(f"🚀 [TourSafe] Neural Telemetry Simulation Initialized")
print(f"📡 API Hub: {API_URL}")
print(f"👣 Syncing {len(MOCK_TOURISTS)} simulated vectors...")

try:
    step = 0
    while True:
        step += 1
        sys.stdout.write(f"\r[Step {step:04d}] Syncing Mesh...")
        sys.stdout.flush()
        
        for t in MOCK_TOURISTS:
            # Physics-based movement
            speed = 0.0006
            t["heading"] += (random.random() - 0.5) * 0.5
            
            # Anomaly Trigger: Drift to danger zone
            if random.random() > 0.96:
                t["lat"] += (DANGER_LAT - t["lat"]) * 0.15
                t["lng"] += (DANGER_LNG - t["lng"]) * 0.15
            else:
                t["lat"] += math.cos(t["heading"]) * speed
                t["lng"] += math.sin(t["heading"]) * speed
            
            # Boundary control
            if abs(t["lat"] - CENTRAL_LAT) > 0.1: t["lat"] = CENTRAL_LAT
            if abs(t["lng"] - CENTRAL_LNG) > 0.1: t["lng"] = CENTRAL_LNG
            
            # Dispatch Telemetry
            try:
                requests.post(f"{API_URL}/tourist/location-update", json={
                    "userId": t["id"],
                    "lat": t["lat"],
                    "lng": t["lng"]
                }, timeout=1)
            except:
                pass
        
        time.sleep(4)

except KeyboardInterrupt:
    print("\n🛑 Telemetry Stream Terminated.")
    sys.exit(0)
