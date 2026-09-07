#!/usr/bin/env python3
"""Generate subject-specific SVG cover art for placeholder projects, render to WebP.
Palette matches the site (blue-ink ground, cyan/blue signal). 1600x900.
Output: assets/img/covers/<slug>.webp
"""
import subprocess
from pathlib import Path

W, H = 1600, 900
OUT = Path("assets/img/covers")
OUT.mkdir(parents=True, exist_ok=True)

PAPER = "#10151c"
PAPER2 = "#161d27"
SIGNAL = "#35e0d0"
SIGNAL2 = "#7aa2ff"
WARN = "#ffb454"
INK = "#eef2f7"
DIM = "#5a6b82"


def frame(inner, accent=SIGNAL):
    grid = ""
    for x in range(0, W + 1, 50):
        grid += f'<line x1="{x}" y1="0" x2="{x}" y2="{H}" stroke="rgba(120,150,190,0.05)" stroke-width="1"/>'
    for y in range(0, H + 1, 50):
        grid += f'<line x1="0" y1="{y}" x2="{W}" y2="{y}" stroke="rgba(120,150,190,0.05)" stroke-width="1"/>'
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
  <defs>
    <radialGradient id="glow" cx="50%" cy="42%" r="60%">
      <stop offset="0%" stop-color="{accent}" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="{accent}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{PAPER2}"/><stop offset="100%" stop-color="{PAPER}"/>
    </linearGradient>
  </defs>
  <rect width="{W}" height="{H}" fill="url(#bg)"/>
  {grid}
  <rect width="{W}" height="{H}" fill="url(#glow)"/>
  {inner}
</svg>'''


def label(text, accent):
    return (f'<text x="{W/2}" y="{H-70}" text-anchor="middle" fill="{DIM}" '
            f'font-family="IBM Plex Mono, monospace" font-size="30" letter-spacing="3">{text}</text>')


def wireless_charger():
    cx, cy = W / 2, H / 2 - 30
    rings = "".join(
        f'<circle cx="{cx}" cy="{cy}" r="{60 + i*46}" fill="none" stroke="{SIGNAL2}" '
        f'stroke-width="{4 - i*0.4}" stroke-opacity="{0.85 - i*0.13}"/>'
        for i in range(5)
    )
    coil = "".join(
        f'<circle cx="{cx}" cy="{cy+250}" r="{18+i*13}" fill="none" stroke="{SIGNAL}" stroke-width="3" stroke-opacity="0.5"/>'
        for i in range(6)
    )
    phone = (f'<rect x="{cx-70}" y="{cy-150}" width="140" height="300" rx="22" fill="{PAPER}" '
             f'stroke="{INK}" stroke-width="3"/><rect x="{cx-55}" y="{cy-130}" width="110" height="250" rx="8" fill="{PAPER2}"/>'
             f'<circle cx="{cx}" cy="{cy-15}" r="10" fill="{SIGNAL}"/>')
    return frame(rings + coil + phone, SIGNAL2)


def arcade():
    cx = W / 2
    body = f'''
      <rect x="{cx-190}" y="180" width="380" height="560" rx="18" fill="{PAPER2}" stroke="{SIGNAL}" stroke-width="4"/>
      <rect x="{cx-150}" y="220" width="300" height="200" rx="10" fill="#05090d" stroke="{SIGNAL2}" stroke-width="3"/>
      <text x="{cx}" y="335" text-anchor="middle" fill="{SIGNAL}" font-family="monospace" font-size="54" font-weight="bold">1UP</text>
      <rect x="{cx-150}" y="450" width="300" height="120" rx="10" fill="{PAPER}"/>
      <circle cx="{cx-70}" cy="510" r="26" fill="{WARN}"/>
      <circle cx="{cx+10}" cy="510" r="20" fill="{SIGNAL2}"/>
      <circle cx="{cx+65}" cy="510" r="20" fill="{SIGNAL}"/>
      <rect x="{cx-110}" y="495" width="14" height="60" rx="7" fill="{INK}"/>
      <rect x="{cx-190}" y="600" width="380" height="140" rx="12" fill="#05090d"/>
    '''
    return frame(body, SIGNAL)


def hackintosh():
    cx = W / 2
    body = f'''
      <rect x="{cx-320}" y="180" width="640" height="400" rx="16" fill="#05090d" stroke="{INK}" stroke-width="4"/>
      <rect x="{cx-295}" y="205" width="590" height="350" rx="6" fill="{PAPER2}"/>
      <circle cx="{cx}" cy="380" r="70" fill="none" stroke="{SIGNAL2}" stroke-width="5"/>
      <path d="M {cx} 320 L {cx} 440 M {cx-60} 380 L {cx+60} 380" stroke="{SIGNAL}" stroke-width="5"/>
      <rect x="{cx-90}" y="580" width="180" height="70" rx="8" fill="#05090d"/>
      <rect x="{cx-200}" y="650" width="400" height="24" rx="10" fill="{PAPER2}"/>
      <circle cx="{cx+250}" cy="250" r="10" fill="{SIGNAL}"/>
      <text x="{cx}" y="386" text-anchor="middle" fill="{SIGNAL}" font-family="monospace" font-size="26">touch</text>
    '''
    return frame(body, SIGNAL2)


def linux_wrappers():
    cx = W / 2
    term = f'''
      <rect x="{cx-380}" y="180" width="760" height="460" rx="16" fill="#05090d" stroke="{SIGNAL}" stroke-width="3"/>
      <rect x="{cx-380}" y="180" width="760" height="46" rx="16" fill="{PAPER2}"/>
      <circle cx="{cx-350}" cy="203" r="9" fill="{WARN}"/><circle cx="{cx-320}" cy="203" r="9" fill="{SIGNAL}"/><circle cx="{cx-290}" cy="203" r="9" fill="{SIGNAL2}"/>
      <text x="{cx-350}" y="300" fill="{SIGNAL}" font-family="monospace" font-size="34">$ ~/bin/deploy --all</text>
      <text x="{cx-350}" y="360" fill="{DIM}" font-family="monospace" font-size="30">→ wrapping 12 tasks…</text>
      <text x="{cx-350}" y="420" fill="{SIGNAL2}" font-family="monospace" font-size="30">✓ ok  ✓ ok  ✓ ok</text>
      <text x="{cx-350}" y="490" fill="{INK}" font-family="monospace" font-size="34">$ <tspan fill="{SIGNAL}">_</tspan></text>
    '''
    return frame(term, SIGNAL)


def nas():
    cx = W / 2
    bays = "".join(
        f'<rect x="{cx-160}" y="{210 + i*90}" width="320" height="70" rx="8" fill="{PAPER}" stroke="{SIGNAL2}" stroke-width="2"/>'
        f'<circle cx="{cx-125}" cy="{245+i*90}" r="9" fill="{SIGNAL if i%2==0 else WARN}"/>'
        f'<rect x="{cx-95}" y="{233+i*90}" width="230" height="24" rx="5" fill="{PAPER2}"/>'
        for i in range(4)
    )
    box = f'<rect x="{cx-190}" y="180" width="380" height="470" rx="16" fill="{PAPER2}" stroke="{INK}" stroke-width="4"/>'
    flow = f'<path d="M {cx+190} 400 C {cx+320} 400 {cx+320} 300 {cx+420} 300" stroke="{SIGNAL}" stroke-width="3" fill="none" stroke-dasharray="8 6"/><circle cx="{cx+420}" cy="300" r="14" fill="none" stroke="{SIGNAL}" stroke-width="3"/>'
    return frame(box + bays + flow, SIGNAL2)


def opt():
    cx = W / 2
    waves = "".join(
        f'<path d="M 0 {480+i*8} Q {W*0.25} {430+i*8} {W*0.5} {480+i*8} T {W} {480+i*8}" '
        f'fill="none" stroke="{SIGNAL2}" stroke-width="{3-i*0.3}" stroke-opacity="{0.7-i*0.09}"/>'
        for i in range(6)
    )
    buoy = f'''
      <ellipse cx="{cx}" cy="478" rx="70" ry="20" fill="{SIGNAL}" fill-opacity="0.25"/>
      <rect x="{cx-45}" y="300" width="90" height="185" rx="20" fill="{PAPER2}" stroke="{SIGNAL}" stroke-width="4"/>
      <rect x="{cx-14}" y="200" width="28" height="110" rx="8" fill="{INK}"/>
      <circle cx="{cx}" cy="190" r="16" fill="{WARN}"/>
      <path d="M {cx} 360 L {cx} 440" stroke="{SIGNAL}" stroke-width="4"/>
      <path d="M {cx-25} 385 L {cx+25} 385 M {cx-25} 410 L {cx+25} 410" stroke="{SIGNAL2}" stroke-width="3"/>
    '''
    return frame(waves + buoy, SIGNAL)


COVERS = {
    "wireless-charger": wireless_charger(),
    "arcade": arcade(),
    "hackintosh": hackintosh(),
    "linux-wrappers": linux_wrappers(),
    "nas": nas(),
    "opt": opt(),
}


def render(slug, svg):
    svg_path = OUT / f"{slug}.svg"
    svg_path.write_text(svg)
    png = OUT / f"{slug}.png"
    # rsvg-convert or cairosvg or sips? use Playwright chromium as a reliable renderer via a tiny html.
    return svg_path


for slug, svg in COVERS.items():
    (OUT / f"{slug}.svg").write_text(svg)
    print(f"wrote {slug}.svg")
print("SVGs written; render step next")
