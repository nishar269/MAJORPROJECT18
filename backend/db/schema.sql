-- ═══════════════════════════════════════════════════════
-- TourSafe Database Schema — PostgreSQL
-- ═══════════════════════════════════════════════════════

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── USERS TABLE ────────────────────────────────
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(100) NOT NULL,
    email           VARCHAR(150) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    role            VARCHAR(20) DEFAULT 'tourist' CHECK (role IN ('tourist', 'police', 'admin')),
    phone           VARCHAR(20),
    nationality     VARCHAR(50),
    passport_hash   VARCHAR(255),  -- SHA-256 hash, not raw data
    avatar_url      VARCHAR(500),
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── TOURIST PROFILES ───────────────────────────
CREATE TABLE tourist_profiles (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id           UUID REFERENCES users(id) ON DELETE CASCADE,
    tourist_id_code   VARCHAR(20) UNIQUE NOT NULL,  -- e.g., USR-3421
    id_hash           VARCHAR(255),                  -- blockchain hash
    emergency_contact VARCHAR(20),
    blood_group       VARCHAR(5),
    hotel_name        VARCHAR(200),
    check_in_date     DATE,
    check_out_date    DATE,
    status            VARCHAR(20) DEFAULT 'safe' CHECK (status IN ('safe', 'warning', 'danger', 'offline')),
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── LOCATIONS ──────────────────────────────────
CREATE TABLE locations (
    id              BIGSERIAL PRIMARY KEY,
    user_id         UUID REFERENCES users(id),
    lat             DECIMAL(10, 7) NOT NULL,
    lng             DECIMAL(10, 7) NOT NULL,
    accuracy        DECIMAL(6, 2),
    speed           DECIMAL(6, 2),
    heading         DECIMAL(5, 2),
    zone_id         INTEGER,
    recorded_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast time-range queries
CREATE INDEX idx_locations_user_time ON locations(user_id, recorded_at DESC);
CREATE INDEX idx_locations_coords ON locations(lat, lng);

-- ─── GEO-FENCE ZONES ───────────────────────────
CREATE TABLE zones (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    lat             DECIMAL(10, 7) NOT NULL,
    lng             DECIMAL(10, 7) NOT NULL,
    radius          INTEGER NOT NULL DEFAULT 300,    -- meters
    risk_level      VARCHAR(10) DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high')),
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── ALERTS ─────────────────────────────────────
CREATE TABLE alerts (
    id              BIGSERIAL PRIMARY KEY,
    message         TEXT NOT NULL,
    severity        VARCHAR(20) DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical', 'success')),
    tourist_id      UUID REFERENCES users(id),
    zone_id         INTEGER REFERENCES zones(id),
    lat             DECIMAL(10, 7),
    lng             DECIMAL(10, 7),
    is_read         BOOLEAN DEFAULT FALSE,
    auto_generated  BOOLEAN DEFAULT FALSE,          -- AI or geo-fence triggered
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_alerts_severity ON alerts(severity, created_at DESC);
CREATE INDEX idx_alerts_tourist ON alerts(tourist_id, created_at DESC);

-- ─── PANIC INCIDENTS ────────────────────────────
CREATE TABLE panic_incidents (
    id                  BIGSERIAL PRIMARY KEY,
    user_id             UUID REFERENCES users(id),
    lat                 DECIMAL(10, 7) NOT NULL,
    lng                 DECIMAL(10, 7) NOT NULL,
    status              VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'responding', 'resolved', 'cancelled')),
    responding_officer  UUID REFERENCES users(id),
    estimated_eta       VARCHAR(20),
    resolved_at         TIMESTAMP,
    notes               TEXT,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── ANOMALIES (AI DETECTION LOG) ──────────────
CREATE TABLE anomalies (
    id              BIGSERIAL PRIMARY KEY,
    user_id         UUID REFERENCES users(id),
    anomaly_type    VARCHAR(50) NOT NULL,            -- 'inactivity', 'speed', 'route', 'sudden_stop'
    confidence      DECIMAL(5, 2) NOT NULL,
    lat             DECIMAL(10, 7),
    lng             DECIMAL(10, 7),
    description     TEXT,
    status          VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'false_positive')),
    model_version   VARCHAR(20),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_anomalies_user ON anomalies(user_id, created_at DESC);

-- ─── BLOCKCHAIN RECORDS ─────────────────────────
CREATE TABLE blockchain_records (
    id              BIGSERIAL PRIMARY KEY,
    block_index     INTEGER NOT NULL,
    id_hash         VARCHAR(255) NOT NULL,
    previous_hash   VARCHAR(255),
    block_hash      VARCHAR(255) NOT NULL,
    validity        BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blockchain_hash ON blockchain_records(id_hash);

-- ─── POLICE OFFICERS ────────────────────────────
CREATE TABLE officers (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id),
    badge_number    VARCHAR(20) UNIQUE,
    station         VARCHAR(100),
    jurisdiction    VARCHAR(100),
    lat             DECIMAL(10, 7),
    lng             DECIMAL(10, 7),
    is_on_duty      BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── SEED DATA ──────────────────────────────────

-- Sample geo-fence zones
INSERT INTO zones (name, description, lat, lng, radius, risk_level) VALUES
('Heritage Zone', 'Historical monuments area — generally safe', 28.6139, 77.2090, 500, 'low'),
('Market District', 'Busy commercial zone with moderate pickpocket risk', 28.6329, 77.2195, 400, 'medium'),
('Sector 7 North', 'Known high-risk area — limited police coverage', 28.5968, 77.2254, 300, 'high'),
('Railway Junction', 'Transit hub with moderate crowd risk', 28.6085, 77.2320, 350, 'medium'),
('Tourist Beach Area', 'Popular tourist beach — lifeguard present', 28.6200, 77.2400, 600, 'low');
