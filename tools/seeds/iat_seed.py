#!/usr/bin/env python3
"""Fake data for the Instrument Asset Tracking demo (CSV-backed Flask app).
Run from the repo root inside its venv: python iat_seed.py
Writes data/*.csv and placeholder instrument photos under static/uploads/.
All students are fictional (@demo.local).
"""
import csv
import os
import random
import uuid
from datetime import datetime, timedelta

import bcrypt
from PIL import Image, ImageDraw, ImageFont

random.seed(7)
DATA = "data"
UP = "static/uploads"
os.makedirs(DATA, exist_ok=True)
os.makedirs(UP, exist_ok=True)
now = datetime.now()
fmt = lambda d: d.strftime("%Y-%m-%d %H:%M:%S")
day = lambda d: d.strftime("%Y-%m-%d")

STUDENTS = [
    ("Avery Chen", 2026), ("Jordan Patel", 2026), ("Riley Nguyen", 2027), ("Sam Okafor", 2027),
    ("Taylor Kim", 2028), ("Morgan Rivera", 2028), ("Casey Brooks", 2029), ("Jamie Lee", 2029),
    ("Dana Whitfield", 2026), ("Robin Alvarez", 2027), ("Quinn Foster", 2028), ("Harper Diaz", 2029),
]
INSTRUMENTS = [
    ("Yamaha", "Flute", "Excellent"), ("Gemeinhardt", "Flute", "Good"), ("Buffet", "Clarinet", "Good"),
    ("Yamaha", "Clarinet", "Fair"), ("Selmer", "Alto Saxophone", "Excellent"), ("Yamaha", "Alto Saxophone", "Good"),
    ("Yamaha", "Tenor Saxophone", "Fair"), ("Bach", "Trumpet", "Excellent"), ("Yamaha", "Trumpet", "Good"),
    ("Getzen", "Trumpet", "Poor"), ("Conn", "French Horn", "Good"), ("Yamaha", "Mellophone", "Good"),
    ("Bach", "Trombone", "Excellent"), ("King", "Trombone", "Fair"), ("Yamaha", "Baritone", "Good"),
    ("Jupiter", "Tuba", "Good"), ("Yamaha", "Sousaphone", "Fair"), ("Pearl", "Snare Drum", "Excellent"),
    ("Ludwig", "Bass Drum", "Good"), ("Fox", "Bassoon", "Excellent"), ("Yamaha", "Oboe", "Good"),
    ("Selmer", "Bass Clarinet", "Fair"),
]
LOCATIONS = ["Band Room Cage A", "Band Room Cage B", "Instrument Closet 2", "Percussion Room"]

def placeholder(name: str, label: str, hue: int):
    path = os.path.join(UP, name)
    if os.path.exists(path):
        return
    im = Image.new("RGB", (900, 600), (0, 0, 0))
    d = ImageDraw.Draw(im)
    for y in range(600):
        c = int(30 + 60 * y / 600)
        d.line([(0, y), (900, y)], fill=(c, c + (hue % 40), c + (hue % 80)))
    d.rounded_rectangle([120, 140, 780, 460], radius=40, outline=(230, 230, 230), width=6)
    try:
        f = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 44)
    except Exception:
        f = ImageFont.load_default()
    d.text((160, 250), label, fill=(240, 240, 240), font=f)
    d.text((160, 320), "demo photo", fill=(180, 180, 180), font=f)
    im.save(path, "JPEG", quality=80)

# --- users (admin comes from config; add staff) ---
with open(os.path.join(DATA, "users.csv"), "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=["first_name", "last_name", "email", "password"])
    w.writeheader()
    for first, last, email in [("Alex", "Morgan", "alex.morgan@demo.local"), ("Priya", "Shah", "priya.shah@demo.local")]:
        w.writerow({"first_name": first, "last_name": last, "email": email,
                    "password": bcrypt.hashpw(b"StaffDemo1!", bcrypt.gensalt()).decode()})

# --- instruments + history ---
inst_rows, hist_rows = [], []
for i, (brand, itype, cond) in enumerate(INSTRUMENTS):
    u = str(uuid.uuid4())[:8].upper()
    serial = f"{brand[:2].upper()}{random.randint(100000, 999999)}"
    img = f"demo-{itype.lower().replace(' ', '-')}-{i}.jpg"
    placeholder(img, f"{brand} {itype}", i * 37)
    checked = i % 3 != 2  # ~2/3 checked out
    row = {
        "brand": brand, "instrument_type": itype, "serial_number": serial, "uuid": u, "condition": cond,
        "checked_out": "Yes" if checked else "No", "location": random.choice(LOCATIONS),
        "student_name": "", "student_email": "", "grad_year": "", "student_id": "", "checkout_term": "",
        "checkout_date": "", "due_date": "", "notes": "", "images": img,
        "school_level": "High School" if i % 4 else "Middle School",
    }
    if cond == "Poor":
        row["notes"] = "Valve 2 sticks; sent to repair shop 3/14. Dent in bell noted at check-in."
    elif cond == "Fair" and i % 2:
        row["notes"] = "Case latch loose. Pads replaced last spring."
    # history: 1–3 cycles per instrument
    t = now - timedelta(days=random.randint(200, 400))
    cycles = random.randint(1, 3)
    for c in range(cycles):
        s_name, s_grad = random.choice(STUDENTS)
        s_email = s_name.lower().replace(" ", ".") + "@demo.local"
        sid = str(100000 + random.randint(0, 89999))
        t += timedelta(days=random.randint(5, 40))
        hist_rows.append({
            "timestamp": fmt(t), "instrument_uuid": u, "student_name": s_name, "student_email": s_email,
            "student_id": sid, "grad_year": s_grad, "checkout_term": "school_year",
            "condition_images": img, "action_type": "checkout",
            "admin_notes": random.choice(["", "", "Mouthpiece included.", "Student provided own reeds.", "Strap missing at pickup."]),
            "storage_location": row["location"], "local_image_paths": img, "cloud_file_ids": "",
        })
        last = c == cycles - 1
        if not (last and checked):
            t += timedelta(days=random.randint(30, 120))
            hist_rows.append({
                "timestamp": fmt(t), "instrument_uuid": u, "student_name": s_name, "student_email": s_email,
                "student_id": sid, "grad_year": s_grad, "checkout_term": "school_year",
                "condition_images": img, "action_type": "checkin",
                "admin_notes": random.choice(["", "Returned clean.", "Minor scratch on bell.", "Needs new pads."]),
                "storage_location": row["location"], "local_image_paths": img, "cloud_file_ids": "",
            })
        else:
            row.update({
                "student_name": s_name, "student_email": s_email, "grad_year": s_grad, "student_id": sid,
                "checkout_term": "school_year", "checkout_date": day(t),
                "due_date": day(t + timedelta(days=180)),
            })
    inst_rows.append(row)

with open(os.path.join(DATA, "instruments.csv"), "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=[
        "brand", "instrument_type", "serial_number", "uuid", "condition", "checked_out", "location",
        "student_name", "student_email", "grad_year", "student_id", "checkout_term", "checkout_date",
        "due_date", "notes", "images", "school_level"])
    w.writeheader(); w.writerows(inst_rows)

hist_rows.sort(key=lambda r: r["timestamp"])
with open(os.path.join(DATA, "checkout_history.csv"), "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=[
        "timestamp", "instrument_uuid", "student_name", "student_email", "student_id", "grad_year",
        "checkout_term", "condition_images", "action_type", "admin_notes", "storage_location",
        "local_image_paths", "cloud_file_ids"])
    w.writeheader(); w.writerows(hist_rows)

with open(os.path.join(DATA, "signup_codes.csv"), "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=["code", "expires_at", "used", "created_at"])
    w.writeheader()
    w.writerow({"code": "DEMO-STAFF-2026", "expires_at": fmt(now + timedelta(days=30)), "used": "False", "created_at": fmt(now)})

open(os.path.join(DATA, ".initialized"), "w").close()
print(f"seeded {len(inst_rows)} instruments, {len(hist_rows)} history rows, 2 staff users")
print("SIGNUP_CODE=DEMO-STAFF-2026")
