#!/usr/bin/env python3
"""Capture a comprehensive gallery of demo pages from the local static server.
Writes PNGs to OUT/<slug>/<name>.png. optimize_images.py turns them into WebP.
Usage: gallery_shots.py OUT_DIR
"""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:8080"
OUT = Path(sys.argv[1])
VP = {"width": 1440, "height": 900}

# slug -> list of (name, url_path, wait_ms, full_page)
SHOTS = {
    "trim-hours": [
        ("landing", "/demo/trim-hours/public/", 500, False),
        ("login", "/demo/trim-hours/public/login/", 400, False),
        ("signup", "/demo/trim-hours/public/signup/q-invite-QNqQy-Gp9UbetJ1fMMBMftjhE8WIviQtjboptMyQsQU/", 400, False),
        ("officer-dashboard", "/demo/trim-hours/officer/dashboard/", 500, True),
        ("officer-events", "/demo/trim-hours/officer/events/", 500, True),
        ("officer-attendance", "/demo/trim-hours/officer/events/1/attendance/", 500, False),
        ("officer-event-edit", "/demo/trim-hours/officer/events/1/edit/", 500, False),
        ("officer-requests", "/demo/trim-hours/officer/requests/", 500, True),
        ("officer-members", "/demo/trim-hours/officer/members/", 500, True),
        ("officer-member-detail", "/demo/trim-hours/officer/members/2/", 500, False),
        ("officer-invites", "/demo/trim-hours/officer/invites/", 500, False),
        ("officer-audit", "/demo/trim-hours/officer/audit/", 500, True),
        ("officer-chapter", "/demo/trim-hours/officer/chapter/", 500, False),
        ("member-dashboard", "/demo/trim-hours/member/dashboard/", 500, True),
        ("member-events", "/demo/trim-hours/member/events/", 500, True),
        ("member-history", "/demo/trim-hours/member/history/", 500, False),
        ("member-report-hours", "/demo/trim-hours/member/report-hours/", 500, False),
        ("member-request-event", "/demo/trim-hours/member/request-event/", 500, False),
    ],
    "nhs-hours": [
        ("landing", "/demo/nhs-hours/public/", 500, False),
        ("login", "/demo/nhs-hours/public/login/", 400, False),
        ("share-roster-expired", "/demo/nhs-hours/public/share/expired/", 400, False),
        ("officer-dashboard", "/demo/nhs-hours/officer/dashboard/", 500, True),
        ("officer-events", "/demo/nhs-hours/officer/events/", 500, True),
        ("officer-attendance", "/demo/nhs-hours/officer/events/1/attendance/", 500, False),
        ("officer-requests", "/demo/nhs-hours/officer/requests/", 500, True),
        ("officer-members", "/demo/nhs-hours/officer/members/", 500, True),
        ("officer-member-detail", "/demo/nhs-hours/officer/members/2/", 500, False),
        ("officer-invites", "/demo/nhs-hours/officer/invites/", 500, False),
        ("officer-chapter", "/demo/nhs-hours/officer/chapter/", 500, False),
        ("officer-audit", "/demo/nhs-hours/officer/audit/", 500, True),
        ("member-dashboard", "/demo/nhs-hours/member/dashboard/", 500, True),
        ("member-events", "/demo/nhs-hours/member/events/", 500, True),
        ("member-history", "/demo/nhs-hours/member/history/", 500, False),
        ("member-report-hours", "/demo/nhs-hours/member/report-hours/", 500, False),
    ],
    "drummajor": [
        ("login", "/demo/drummajor/public/login/", 400, False),
        ("dashboard", "/demo/drummajor/admin/dashboard/", 600, True),
        ("announcements", "/demo/drummajor/admin/announcements/", 600, True),
        ("announcement-composer", "/demo/drummajor/admin/announcements/new/", 600, False),
        ("announcement-detail", "/demo/drummajor/admin/announcements/c635822f10d775b12f2cf0b50/", 600, True),
        ("library", "/demo/drummajor/admin/library/", 600, True),
        ("library-music", "/demo/drummajor/admin/library/lib_root_music/", 600, True),
        ("events", "/demo/drummajor/admin/events/", 600, True),
        ("tasks", "/demo/drummajor/admin/tasks/", 600, True),
        ("notes", "/demo/drummajor/admin/notes/", 600, False),
        ("handoff", "/demo/drummajor/admin/handoff/", 600, True),
        ("rosters", "/demo/drummajor/admin/rosters/", 600, True),
        ("invites", "/demo/drummajor/admin/invites/", 600, False),
        ("audit", "/demo/drummajor/admin/audit/", 600, True),
        ("users", "/demo/drummajor/admin/admin/users/", 600, True),
        ("settings", "/demo/drummajor/admin/settings/", 600, False),
    ],
    "instrument-tracking": [
        ("landing", "/demo/instrument-tracking/public/", 500, False),
        ("catalog", "/demo/instrument-tracking/public/catalog/", 500, True),
        ("features", "/demo/instrument-tracking/public/features/", 500, True),
        ("login", "/demo/instrument-tracking/public/login/", 400, False),
        ("dashboard", "/demo/instrument-tracking/admin/dashboard/", 600, True),
        ("instruments", "/demo/instrument-tracking/admin/instruments/", 600, True),
        ("add-instrument", "/demo/instrument-tracking/admin/add-instrument/", 500, False),
        ("edit-instrument", "/demo/instrument-tracking/admin/edit_instrument/8950AEBB/", 500, False),
        ("instrument-history", "/demo/instrument-tracking/admin/instrument_history/8950AEBB/", 500, True),
        ("check-in", "/demo/instrument-tracking/admin/check-in/", 500, True),
        ("users", "/demo/instrument-tracking/admin/users/", 500, False),
        ("settings", "/demo/instrument-tracking/admin/settings/", 500, False),
    ],
    "safetyboston": [
        ("feed", "/demo/safetyboston/dashboard/", 500, False),
        ("reports", "/demo/safetyboston/reports/", 500, False),
        ("detail", "/demo/safetyboston/detail/", 500, False),
        ("map", "/demo/safetyboston/map/", 500, False),
    ],
    "relativity": [
        ("platform", "/demo/relativity-train/", 1600, False),
    ],
    "freshline": [
        ("hero", "/demo/freshline/", 2500, False),
    ],
    "humscore": [
        ("app", "/demo/humscore/", 1200, False),
    ],
    "rotlang": [
        ("docs", "/demo/rotlang/", 600, False),
    ],
}


def main():
    with sync_playwright() as p:
        b = p.chromium.launch()
        for slug, shots in SHOTS.items():
            outdir = OUT / slug
            outdir.mkdir(parents=True, exist_ok=True)
            for name, path, wait, full in shots:
                pg = b.new_page(viewport=VP, device_scale_factor=1)
                try:
                    pg.goto(BASE + path, wait_until="networkidle", timeout=25000)
                    pg.wait_for_timeout(wait)
                    # hide the demo banner so gallery shots show the app cleanly
                    pg.evaluate("() => { const el = document.getElementById('nb-demo-banner'); if (el) el.remove(); }")
                    pg.wait_for_timeout(120)
                    pg.screenshot(path=str(outdir / f"{name}.png"), full_page=full)
                    print(f"  ✓ {slug}/{name}")
                except Exception as e:
                    print(f"  ✗ {slug}/{name}: {e.__class__.__name__}")
                pg.close()
        b.close()


if __name__ == "__main__":
    main()
