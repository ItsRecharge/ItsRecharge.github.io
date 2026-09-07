#!/usr/bin/env python3
"""Bespoke static snapshot for SafetyBoston (client-only React SPA).
Renders the dashboard tabs live (auth injected via sessionStorage), freezes each
rendered DOM, inlines the built CSS, strips scripts, and injects the demo banner.
Output: demo/safetyboston/{dashboard,events,reports,map,detail,report}/index.html
Requires the app running at http://127.0.0.1:8000 with fake seed data.
"""
import base64
import re
from pathlib import Path

from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "demo" / "safetyboston"
ASSETS = OUT / "assets"
BASE = "http://127.0.0.1:8000"
AUTH = base64.b64encode(b"admin:admin").decode()

TABS = [
    ("dashboard", "events", "Live incident feed with confidence scores and status."),
    ("events", "events", None),
    ("reports", "reports", None),
    ("map", "map", None),
]


def freeze(page, ctx, banner_links, title, note):
    html = page.content()
    soup = BeautifulSoup(html, "lxml")
    for s in soup.find_all("script"):
        s.decompose()
    for l in soup.find_all("link"):
        rels = set(l.get("rel") or [])
        if rels & {"preload", "modulepreload", "prefetch"}:
            l.decompose()
    # inline built stylesheets
    for l in list(soup.find_all("link", rel=lambda r: r and "stylesheet" in r)):
        href = l.get("href", "")
        if href.startswith("data:"):
            continue
        try:
            r = ctx.request.get(BASE + href if href.startswith("/") else href)
            if r.ok:
                st = soup.new_tag("style")
                st.string = r.text()
                l.replace_with(st)
        except Exception:
            pass
    # local-ize any /api/videos or asset URLs referenced (posters etc.)
    for tag in soup.find_all(["img", "video", "source"]):
        for attr in ("src", "poster"):
            v = tag.get(attr)
            if v and (v.startswith("/") or v.startswith(BASE)):
                tag[attr] = "#"  # media not shipped; demo shows the UI chrome
    # banner
    for m in soup.find_all("meta", attrs={"http-equiv": True}):
        m.decompose()
    head = soup.head
    css = soup.new_tag("link", rel="stylesheet", href="../../_shared/demo.css")
    head.append(css)
    body = soup.body
    banner = BeautifulSoup(banner_html(banner_links, title, note), "html.parser")
    body.insert(0, banner)
    js = soup.new_tag("script", src="../../_shared/demo.js", defer="")
    body.append(js)
    return str(soup)


def banner_html(links, title, note):
    ls = "".join(
        f'<a class="{"nb-active" if a else ""}" href="{href}">{label}</a>'
        for label, href, a in links
    )
    return (
        '<div id="nb-demo-banner">'
        '<span class="nb-tag">Static demo</span>'
        f'<span class="nb-msg"><b>{title}</b> — test site with fake incident data and no backend. '
        'Clips and the live map aren’t shipped; click the tabs to explore the UI.</span>'
        f'<span class="nb-links">{ls}<a class="nb-home" href="../../../">← Portfolio</a></span>'
        "</div>"
    )


def main():
    ASSETS.mkdir(parents=True, exist_ok=True)
    links = [
        ("Feed", "../dashboard/", False),
        ("Events", "../events/", False),
        ("Reports", "../reports/", False),
        ("Map", "../map/", False),
        ("Public report", "../report/", False),
    ]
    with sync_playwright() as p:
        b = p.chromium.launch()
        ctx = b.new_context(viewport={"width": 1440, "height": 900})
        ctx.add_init_script(f"sessionStorage.setItem('dt_auth', '{AUTH}')")
        page = ctx.new_page()
        for name, tab, note in TABS:
            page.goto(BASE + "/", wait_until="networkidle")
            page.wait_for_timeout(700)
            # click the sidebar tab
            for sel in [f"button:has-text('{tab.title()}')", f".nav-item:has-text('{tab.title()}')"]:
                loc = page.locator(sel)
                if loc.count():
                    loc.first.click()
                    break
            page.wait_for_timeout(900)
            active = [(lbl, href, lbl.lower().startswith(name[:4]) or (name == "dashboard" and lbl == "Feed")) for lbl, href, _ in links]
            out = OUT / name
            out.mkdir(parents=True, exist_ok=True)
            (out / "index.html").write_text(freeze(page, ctx, active, "SafetyBoston", note), encoding="utf-8")
            print(f"  + {name}")
        # event detail modal (open first event on the events tab)
        page.goto(BASE + "/", wait_until="networkidle")
        page.wait_for_timeout(700)
        for sel in ["button:has-text('Events')", ".nav-item:has-text('Events')"]:
            if page.locator(sel).count():
                page.locator(sel).first.click()
                break
        page.wait_for_timeout(800)
        opened = False
        for sel in [".event-card", ".event-row", "tbody tr", "[class*=event]"]:
            if page.locator(sel).count():
                try:
                    page.locator(sel).first.click()
                    page.wait_for_timeout(800)
                    opened = True
                    break
                except Exception:
                    pass
        if opened:
            active = [(lbl, href, False) for lbl, href, _ in links]
            out = OUT / "detail"
            out.mkdir(parents=True, exist_ok=True)
            (out / "index.html").write_text(freeze(page, ctx, active, "SafetyBoston", None), encoding="utf-8")
            print("  + detail")
        # public report form (own route)
        page.goto(BASE + "/report", wait_until="networkidle")
        page.wait_for_timeout(700)
        active = [(lbl, href, lbl == "Public report") for lbl, href, _ in links]
        out = OUT / "report"
        out.mkdir(parents=True, exist_ok=True)
        (out / "index.html").write_text(freeze(page, ctx, active, "SafetyBoston", None), encoding="utf-8")
        print("  + report")
        b.close()
    print(f"done -> {OUT}")


if __name__ == "__main__":
    main()
