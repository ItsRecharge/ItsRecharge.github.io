#!/usr/bin/env python3
"""Optimize screenshots for the portfolio: resize to <= MAX_W wide, write WebP.

Usage: optimize_images.py SRC_FILE_OR_DIR DEST_DIR [--max 1600] [--q 80]
Preserves aspect ratio. SVG/GIF are copied as-is. Output name = <stem>.webp
"""
import argparse
import shutil
import sys
from pathlib import Path

from PIL import Image

RASTER = {".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tif", ".tiff"}
PASSTHRU = {".svg", ".gif"}


def convert(src: Path, dest_dir: Path, max_w: int, q: int) -> Path | None:
    ext = src.suffix.lower()
    dest_dir.mkdir(parents=True, exist_ok=True)
    if ext in PASSTHRU:
        out = dest_dir / src.name
        shutil.copy2(src, out)
        return out
    if ext not in RASTER:
        return None
    out = dest_dir / (src.stem + ".webp")
    with Image.open(src) as im:
        im.load()
        if im.mode in ("P", "LA") or (im.mode == "RGBA" and _has_alpha(im)):
            im = im.convert("RGBA")
        else:
            im = im.convert("RGB")
        if im.width > max_w:
            nh = round(im.height * max_w / im.width)
            im = im.resize((max_w, nh), Image.LANCZOS)
        im.save(out, "WEBP", quality=q, method=6)
    return out


def _has_alpha(im: Image.Image) -> bool:
    try:
        return im.getchannel("A").getextrema()[0] < 255
    except Exception:
        return False


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("dest")
    ap.add_argument("--max", type=int, default=1600)
    ap.add_argument("--q", type=int, default=80)
    a = ap.parse_args()
    src, dest = Path(a.src), Path(a.dest)
    files = [src] if src.is_file() else sorted(p for p in src.iterdir() if p.is_file())
    n = 0
    for f in files:
        out = convert(f, dest, a.max, a.q)
        if out:
            n += 1
            print(f"{f.name} -> {out.relative_to(dest.parent.parent) if dest.parent.parent in out.parents else out} ({out.stat().st_size // 1024} KB)")
    print(f"{n} images -> {dest}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
