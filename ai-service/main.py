import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
from sklearn.ensemble import IsolationForest
import datetime
import random

app = FastAPI(title="TourSafe AI Anomaly Engine")

# --- MODELS ---
class TelemetryData(BaseModel):
    user_id: str
    lat: float
    lng: float
    timestamp: str
    risk_zone: bool

class DetectionResult(BaseModel):
    anomaly: bool
    reason: str
    confidence: float
    timestamp: str

# --- ML ENGINE ---
# In a real app, this would be pre-trained on historical tourist movement data.
# For this project, we initialize a model and "warm" it with some baseline data.
model = IsolationForest(contamination=0.1, random_state=42)

# Global store for user history to detect patterns
user_history = {}

def train_baseline():
    # Simulate normal movement patterns (centered around New Delhi for demo)
    # 28.6139, 77.2090
    lat_base = 28.6139
    lng_base = 77.2090
    
    # Generate 1000 'normal' points
    normal_lats = np.random.normal(lat_base, 0.05, 1000)
    normal_lngs = np.random.normal(lng_base, 0.05, 1000)
    
    X = np.column_stack((normal_lats, normal_lngs))
    model.fit(X)
    print("AI Model trained with baseline movement data.")

@app.on_event("startup")
async def startup_event():
    train_baseline()

@app.post("/detect", response_model=DetectionResult)
async def detect_anomaly(data: TelemetryData):
    """
    Analyzes tourist location data to detect unusual behavior.
    Uses Isolation Forest for spatial anomaly detection + Rule Engine for logic.
    """
    
    # 1. Spatial Anomaly Check (ML)
    X_test = np.array([[data.lat, data.lng]])
    prediction = model.predict(X_test)
    is_spatial_anomaly = prediction[0] == -1
    
    # 2. Rule-based checks (Heuristics)
    reason = "Normal patterns maintained."
    is_anomaly = False
    confidence = 0.0
    
    # Check if in risk zone
    if data.risk_zone:
        is_anomaly = True
        reason = "Tourist in high-risk restricted zone."
        confidence = 0.85
        
    # Check for long-term inactivity (Simulated)
    # If user stays in the same spot for 2 hours (not implemented fully here but logic would go here)
    
    # Check for sudden spatial outliers
    if is_spatial_anomaly and not is_anomaly:
        is_anomaly = True
        reason = "Spatial outlier detected. Movement deviates significantly from normal tourist routes."
        confidence = 0.72
        
    # Final Decision
    return DetectionResult(
        anomaly=is_anomaly,
        reason=reason,
        confidence=confidence if is_anomaly else random.uniform(0.01, 0.1),
        timestamp=datetime.datetime.utcnow().isoformat()
    )

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "anomaly_engine", "model": "IsolationForest"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
