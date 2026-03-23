# 🛡️ TourSafe: AI-Powered Tourist Safety Monitoring Ecosystem

TourSafe is an intelligent safety platform designed to protect travelers through real-time telemetry, AI anomaly detection, and decentralized identity verification. This ecosystem combines a high-fidelity PWA, a real-time Node.js backend, and a dedicated Machine Learning service.

## 🌟 Core Features

-   **🤖 AI Anomaly Engine**: Detects unusual tourist movements (sudden stops, deviation from heritage paths) using an **Isolation Forest** ML model.
-   **📡 Real-Time Telemetry**: Seamlessly track thousands of concurrent tourists via **WebSockets (Socket.io)** with sub-second latency.
-   **⛓️ Blockchain Identity**: Tamper-proof identity verification using an immutable **SHA-256 chain** to prevent tourist spoofing.
-   **📍 Dynamic Geo-Fencing**: Automated danger zone alerts when a tourist enters high-risk areas (e.g., restricted zones, high-crime sectors).
-   **📲 Progressive Web App (PWA)**: Fully installable in Chrome/Edge, providing a native experience with background safety notifications.
-   **🚨 Universal Panic System**: One-tap SOS integration with instant police dashboard priority dispatching.

---

## 🏗️ System Architecture

The ecosystem consists of three main decoupled services:

1.  **Frontend (React/Vite)**: The user interface for both tourists and law enforcement. Uses Framer Motion for premium aesthetics and Mapbox for geospatial visualization.
2.  **Backend (Node.js/Express)**: The central nervous system. Handles authentication (JWT), identity management, and real-time event routing.
3.  **AI Service (FastAPI/Python)**: The intelligence layer. Processes telemetry streams to identify behavioral anomalies using Scikit-Learn.

---

## 🚀 Quick Start Guide

### Option 1: Docker (Recommended)
Launch the entire ecosystem with a single command:
```bash
docker-compose up --build
```

### Option 2: Manual Setup

1.  **Backend**:
    ```bash
    cd backend
    npm install
    npm run dev
    ```
2.  **AI Service**:
    ```bash
    cd ai-service
    pip install -r requirements.txt
    uvicorn main:app --reload
    ```
3.  **Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

---

## 🧠 Machine Learning Overview
TourSafe utilizes an **Isolation Forest** algorithm to identify anomalies in a 2D spatial plane. Unlike traditional classification, Isolation Forest identifies outliers without needing a vast amount of historical labeled "bad" behavior, making it ideal for detecting unexpected safety situations in real-time.

## 🔒 Security & Privacy
TourSafe is built on the principle of **Data Minimization**. PII (Personally Identifiable Information) is hashed onto a local blockchain identity layer. This ensures that while identity is verifiable, the raw data remains private until an actual emergency alert is triggered.

---

## 👥 Roles & Access
| Feature | Tourist (PWA) | Police (Dashboard) |
| :--- | :---: | :---: |
| GPS Tracking | ✅ | ✅ |
| SOS Panic Button | ✅ | ❌ |
| AI Anomaly View | ❌ | ✅ |
| Heatmap Overlays | ❌ | ✅ |
| Settings/Config | ✅ | ✅ |

---

*Built with ❤️ for a safer world | © 2026 TourSafe Identity Systems*
