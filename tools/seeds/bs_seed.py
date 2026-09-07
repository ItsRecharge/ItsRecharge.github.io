#!/usr/bin/env python3
"""Fake events for the SafetyBoston demo (SQLite + placeholder clips).
Run from server/ inside its venv: python bs_seed.py
Boston-area coordinates; all data fictional.
"""
import os
import sqlite3
from datetime import datetime, timedelta

DB = os.getenv("DB_PATH", "./storage/events.db")
VID = os.getenv("VIDEO_STORAGE_PATH", "./storage/videos")
os.makedirs(os.path.dirname(DB), exist_ok=True)
os.makedirs(VID, exist_ok=True)

# 1x1 black mp4-ish placeholder bytes (a tiny valid-enough file; the demo never plays it)
PLACEHOLDER = bytes.fromhex(
    "000000206674797069736f6d0000020069736f6d69736f32617663316d703431"
)

now = datetime.now()
ts = lambda mins: (now - timedelta(minutes=mins)).strftime("%Y-%m-%d %H:%M:%S")

# (camera_id, location, lat, lng, minutes_ago, confidence, source, status)
EVENTS = [
    ("cam-001", "Boston Common — Park St", 42.3554, -71.0655, 12, 0.82, "camera", "pending"),
    ("cam-002", "Downtown Crossing", 42.3555, -71.0603, 34, 0.74, "camera", "approved"),
    ("cam-003", "South Station — Atlantic Ave", 42.3519, -71.0552, 58, 0.66, "camera", "approved"),
    ("cam-004", "North End — Hanover St", 42.3647, -71.0542, 77, 0.91, "camera", "pending"),
    ("cam-005", "Back Bay — Boylston St", 42.3503, -71.0810, 95, 0.58, "camera", "approved"),
    ("cam-006", "Fenway — Lansdowne St", 42.3467, -71.0972, 120, 0.79, "camera", "approved"),
    ("cam-002", "Downtown Crossing", 42.3555, -71.0603, 143, 0.63, "camera", "approved"),
    ("cam-007", "Seaport — Northern Ave", 42.3519, -71.0409, 165, 0.88, "camera", "pending"),
    ("mobile-report", "Charles St / Beacon Hill", 42.3572, -71.0703, 40, 0.0, "manual", "pending"),
    ("mobile-report", "Kenmore Sq", 42.3487, -71.0954, 88, 0.0, "manual", "approved"),
    ("mobile-report", "Chinatown Gate", 42.3515, -71.0621, 132, 0.0, "manual", "pending"),
    ("cam-008", "Cambridge St / West End", 42.3612, -71.0660, 210, 0.71, "camera", "approved"),
]


def init(conn):
    conn.execute(
        """CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            camera_id TEXT NOT NULL, location TEXT NOT NULL, lat REAL, lng REAL,
            timestamp TEXT NOT NULL, confidence REAL NOT NULL, video_filename TEXT NOT NULL,
            source TEXT NOT NULL DEFAULT 'camera', status TEXT NOT NULL DEFAULT 'approved',
            created_at TEXT NOT NULL DEFAULT (datetime('now')))"""
    )


conn = sqlite3.connect(DB)
init(conn)
for i, (cam, loc, lat, lng, mins, conf, src, status) in enumerate(EVENTS, 1):
    fn = f"clip-{i:03d}.mp4"
    with open(os.path.join(VID, fn), "wb") as f:
        f.write(PLACEHOLDER)
    conn.execute(
        "INSERT INTO events (camera_id,location,lat,lng,timestamp,confidence,video_filename,source,status) VALUES (?,?,?,?,?,?,?,?,?)",
        (cam, loc, lat, lng, ts(mins), conf, fn, src, status),
    )
conn.commit()
conn.close()
print(f"seeded {len(EVENTS)} events + placeholder clips into {DB}")
