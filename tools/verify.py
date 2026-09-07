#!/usr/bin/env python3
"""Verify the built portfolio: internal links resolve, no forbidden strings leak,
report per-area sizes. Run from repo root: python tools/verify.py
"""
import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlparse

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent
FORBIDDEN = [
    "http://localhost", "https://localhost", "127.0.0.1", "145.132.97.45",
    ":3100", ":3101", ":3102", ":5001", ":8000", ":5055",
    "winchester", "wpsstudent", "winchesterps", "neelmbansal", "neel.m.bansal",
]
# Placeholder example addresses in form fields are fine; real personal ones are not.
ALLOWED_SUBSTR = ["your-email@gmail.com", "you@example.com", "user@example.com", "band@example.edu"]
# demo apps intentionally keep their own scripts? No — snapshots strip them. Bundles keep scripts.
BUNDLE_DIRS = {"relativity-train", "humscore", "rotlang", "freshline"}

issues = []
scanned = 0
missing_links = 0


def is_internal(href: str) -> bool:
    if not href:
        return False
    if re.match(r"^(https?:|mailto:|tel:|data:|javascript:|#)", href, re.I):
        return False
    return True


def check_html(f: Path):
    global scanned, missing_links
    scanned += 1
    text = f.read_text(encoding="utf-8", errors="replace")
    low = text.lower()
    for allowed in ALLOWED_SUBSTR:
        low = low.replace(allowed.lower(), "")
    for bad in FORBIDDEN:
        if bad.lower() in low:
            issues.append(f"FORBIDDEN '{bad}' in {f.relative_to(ROOT)}")
    soup = BeautifulSoup(text, "lxml")
    for tag, attr in [("a", "href"), ("link", "href"), ("img", "src"), ("script", "src"), ("iframe", "src"), ("source", "src")]:
        for e in soup.find_all(tag):
            v = e.get(attr)
            if not v or not is_internal(v):
                continue
            if e.get("data-demo-dead") or v == "#":
                continue
            target = unquote(urlparse(v).path)
            # site-absolute paths ("/demo/humscore/assets/x.js") resolve from repo root on the deployed site
            base_dir = ROOT if target.startswith("/") else f.parent
            target = target.lstrip("/")
            if v.endswith("/") or (base_dir / target).is_dir():
                cand = (base_dir / target / "index.html")
            else:
                cand = (base_dir / target)
            cand = cand.resolve()
            if not cand.exists():
                # directory without trailing slash?
                alt = (f.parent / target / "index.html").resolve()
                if not alt.exists():
                    missing_links += 1
                    issues.append(f"BROKEN link '{v}' in {f.relative_to(ROOT)}")


def du(path: Path) -> str:
    total = sum(p.stat().st_size for p in path.rglob("*") if p.is_file())
    for unit in ["B", "KB", "MB", "GB"]:
        if total < 1024:
            return f"{total:.1f}{unit}"
        total /= 1024
    return f"{total:.1f}TB"


def main():
    for f in ROOT.rglob("index.html"):
        if "node_modules" in f.parts or ".git" in f.parts:
            continue
        check_html(f)
    # also top-level html
    for f in ROOT.glob("*.html"):
        check_html(f)

    print(f"scanned {scanned} html files")
    print(f"repo size: {du(ROOT)} (minus .git: see below)")
    for area in ["assets", "demo", "tools"]:
        p = ROOT / area
        if p.exists():
            print(f"  {area}/: {du(p)}")
    print()
    if issues:
        print(f"❌ {len(issues)} issues ({missing_links} broken links):")
        for i in issues[:60]:
            print("  -", i)
        if len(issues) > 60:
            print(f"  … and {len(issues) - 60} more")
        return 1
    print("✅ no broken internal links, no forbidden strings")
    return 0


if __name__ == "__main__":
    sys.exit(main())
