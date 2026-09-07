#!/usr/bin/env python3
"""Screenshots of the functional demo bundles served at http://127.0.0.1:8080.
Writes PNGs to a scratch dir; optimize_images.py turns them into WebP for the site.
Usage: shots_bundles.py OUT_DIR
"""
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:8080"
out = Path(sys.argv[1])
out.mkdir(parents=True, exist_ok=True)
VP = {"width": 1440, "height": 900}


def shot(page, name, full=False):
    page.screenshot(path=str(out / f"{name}.png"), full_page=full)
    print(" ✓", name)


with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport=VP, device_scale_factor=1)
    page = ctx.new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))

    # --- Relativity Express: platform frame, train frame, paused mid-pass ---
    page.goto(f"{BASE}/demo/relativity-train/", wait_until="networkidle")
    page.wait_for_function("() => window.__sim !== undefined")
    page.wait_for_timeout(1500)
    page.evaluate("() => { const s = window.__sim; s.paused = true; s.trainPhase = 0; s.beta = 0.8; }")
    page.wait_for_timeout(400)
    shot(page, "relativity-platform")
    page.click("#btnTrain")
    page.wait_for_timeout(800)
    page.evaluate("() => { const s = window.__sim; s.paused = true; }")
    page.wait_for_timeout(300)
    shot(page, "relativity-train")
    page.click("#btnPlatform")
    page.evaluate("() => { const s = window.__sim; s.paused = false; s.beta = 0.95; }")
    page.wait_for_timeout(1200)
    page.evaluate("() => { window.__sim.paused = true; }")
    page.wait_for_timeout(300)
    shot(page, "relativity-fast")

    # --- RotLang docs + playground running Flappy Bird ---
    page.goto(f"{BASE}/demo/rotlang/", wait_until="networkidle")
    page.wait_for_timeout(500)
    shot(page, "rotlang-docs")
    shot(page, "rotlang-docs-full", full=True)
    page.goto(f"{BASE}/demo/rotlang/play/#example=flappy", wait_until="networkidle")
    page.wait_for_timeout(800)
    for sel in ["button:has-text('Run')", "#run", "button[data-run]"]:
        if page.locator(sel).count():
            page.locator(sel).first.click()
            break
    page.wait_for_timeout(1500)
    page.keyboard.press("Space")
    page.wait_for_timeout(700)
    shot(page, "rotlang-play-flappy")

    # --- Freshline landing ---
    page.goto(f"{BASE}/demo/freshline/", wait_until="networkidle")
    page.wait_for_timeout(2500)
    shot(page, "freshline-hero")
    page.mouse.wheel(0, 900)
    page.wait_for_timeout(1200)
    shot(page, "freshline-section2")
    page.mouse.wheel(0, 1200)
    page.wait_for_timeout(1200)
    shot(page, "freshline-section3")
    shot(page, "freshline-full", full=True)

    # --- HumScore empty state ---
    page.goto(f"{BASE}/demo/humscore/", wait_until="networkidle")
    page.wait_for_timeout(1200)
    shot(page, "humscore-app")

    b.close()
    print("page errors:", errors if errors else "none")
