#!/usr/bin/env python3
"""Static click-through snapshotter for the portfolio demos.

Given a running app and a JSON config, logs in per role, BFS-crawls same-origin
links, saves each route's rendered DOM as <out>/<role>/<route>/index.html with
scripts stripped, downloads stylesheets/images into <out>/assets/, rewrites URLs
to relative paths, and injects the shared demo banner + demo.js.

Usage: snapshot.py tools/apps/<slug>.json

Config keys:
  slug, title, base_url, out_dir
  roles: [{ name, landing, login: {url, fill: {selector: value}, submit, expect_url},
            init_script, seeds: [paths], synthetic: [{name, path, click, wait, save_as}] }]
  exclude: [regex...]            # routes never crawled
  max_pages: int                 # per role safety cap (default 120)
  viewport: {width, height}
  login_form_role: name          # which role the public login form should "log into"
  external_css: bool             # download cross-origin stylesheets (CDNs) too
  fonts_inline: bool             # rewrite Google Fonts <link> to local (best-effort)
"""
from __future__ import annotations

import hashlib
import json
import mimetypes
import os
import re
import sys
import time
from collections import deque
from pathlib import Path
from urllib.parse import urljoin, urlparse, urlunparse

from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
SHARED_REL = "/demo/_shared"  # absolute on the deployed site; rewritten to relative per page

SKIP_HREF = re.compile(r"^(mailto:|tel:|javascript:|data:|#|blob:)", re.I)
DEFAULT_EXCLUDE = [r"/api/", r"/_next/", r"/logout", r"\.csv$", r"\.pdf$", r"\?next=", r"/auth/", r"/signout"]
STRIP_LINK_RELS = {"preload", "modulepreload", "prefetch", "dns-prefetch", "preconnect", "manifest"}


class Snapshotter:
    def __init__(self, cfg: dict):
        self.cfg = cfg
        self.base = cfg["base_url"].rstrip("/")
        self.origin = urlparse(self.base).netloc
        self.out = (ROOT / cfg["out_dir"]).resolve()
        self.assets = self.out / "assets"
        self.assets.mkdir(parents=True, exist_ok=True)
        self.exclude = [re.compile(p) for p in DEFAULT_EXCLUDE + cfg.get("exclude", [])]
        self.max_pages = cfg.get("max_pages", 120)
        self.asset_cache: dict[str, str] = {}  # absolute url -> assets/<name>
        self.roles = cfg["roles"]
        self.pages_written = 0
        self.viewport = cfg.get("viewport", {"width": 1366, "height": 900})

    # ---------- URL helpers ----------
    def normalize(self, url: str) -> str | None:
        u = urlparse(url)
        if u.netloc and u.netloc != self.origin:
            return None
        path = u.path or "/"
        q = u.query
        # keep query only when config says the route is query-driven (e.g. invite tokens)
        keep_q = q and any(k in q for k in self.cfg.get("keep_query_keys", ["invite", "token"]))
        norm = urlunparse(("", "", path, "", q if keep_q else "", ""))
        for rx in self.exclude:
            if rx.search(norm):
                return None
        return norm

    @staticmethod
    def route_dir(route: str) -> str:
        """'/officer/events/1/edit?x=y' -> 'officer/events/1/edit' ; '/' -> ''"""
        p = urlparse(route)
        path = p.path.strip("/")
        if p.query:
            path = (path + "/q-" + re.sub(r"[^A-Za-z0-9]+", "-", p.query))[:180]
        return path

    def rdir(self, route: str, role: dict) -> str:
        """route_dir with the role's own prefix removed ('/member/events' -> 'events')."""
        rd = self.route_dir(route)
        pre = role.get("strip", "").strip("/")
        if pre and (rd == pre or rd.startswith(pre + "/")):
            rd = rd[len(pre):].lstrip("/")
        return rd

    def rel_prefix(self, depth: int) -> str:
        return "../" * depth if depth else "./"

    # ---------- asset download ----------
    def fetch_asset(self, context, abs_url: str) -> str | None:
        if abs_url in self.asset_cache:
            return self.asset_cache[abs_url]
        try:
            resp = context.request.get(abs_url, timeout=20000)
            if not resp.ok:
                return None
            body = resp.body()
        except Exception:
            return None
        ctype = resp.headers.get("content-type", "").split(";")[0].strip()
        ext = mimetypes.guess_extension(ctype) or Path(urlparse(abs_url).path).suffix or ".bin"
        if ext == ".jpe":
            ext = ".jpg"
        if ctype == "text/css":
            ext = ".css"
        h = hashlib.sha1(abs_url.encode()).hexdigest()[:12]
        stem = re.sub(r"[^A-Za-z0-9._-]+", "-", Path(urlparse(abs_url).path).stem)[:40] or "asset"
        name = f"{stem}-{h}{ext}"
        dest = self.assets / name
        if ctype == "text/css":
            body = self.rewrite_css(context, body.decode("utf-8", "replace"), abs_url).encode()
        dest.write_bytes(body)
        rel = f"assets/{name}"
        self.asset_cache[abs_url] = rel
        return rel

    def rewrite_css(self, context, css: str, css_url: str) -> str:
        def repl(m):
            raw = m.group(2).strip()
            if SKIP_HREF.match(raw) or raw.startswith("data:"):
                return m.group(0)
            abs_u = urljoin(css_url, raw)
            local = self.fetch_asset(context, abs_u)
            if not local:
                return m.group(0)
            return f"url({m.group(1)}{Path(local).name}{m.group(1)})"
        css = re.sub(r"url\((['\"]?)([^)'\"]+)\1\)", repl, css)
        css = re.sub(r"@import\s+url\(([^)]+)\)", lambda m: "", css)  # imports were already followed via url()
        return css

    # ---------- HTML post-processing ----------
    def process_html(self, context, html: str, page_url: str, role: dict, depth: int) -> str:
        soup = BeautifulSoup(html, "lxml")
        keep_scripts = self.cfg.get("keep_scripts", False)
        for s in soup.find_all("script"):
            if not keep_scripts:
                s.decompose()
        for t in soup.find_all(["nextjs-portal", "next-route-announcer", "template"]):
            t.decompose()
        for l in soup.find_all("link"):
            rels = set((l.get("rel") or []))
            if rels & STRIP_LINK_RELS:
                l.decompose()
        for tag in soup.find_all(True):
            for attr in list(tag.attrs):
                if attr.lower().startswith("on"):
                    del tag[attr]
        for tag in soup.find_all(attrs={"href": True}):
            if tag.name != "a" and tag.name != "link":
                continue
        # stylesheets
        for l in soup.find_all("link", rel=lambda r: r and "stylesheet" in r):
            href = l.get("href")
            if not href or SKIP_HREF.match(href):
                continue
            abs_u = urljoin(page_url, href)
            if urlparse(abs_u).netloc != self.origin and not self.cfg.get("external_css", True):
                continue
            local = self.fetch_asset(context, abs_u)
            if local:
                l["href"] = self.rel_prefix(depth) + local
        # inline style url()s
        for tag in soup.find_all(style=True):
            tag["style"] = re.sub(
                r"url\((['\"]?)([^)'\"]+)\1\)",
                lambda m: self._inline_url(context, m, page_url, depth),
                tag["style"],
            )
        for st in soup.find_all("style"):
            if st.string:
                st.string = re.sub(
                    r"url\((['\"]?)([^)'\"]+)\1\)",
                    lambda m: self._inline_url(context, m, page_url, depth),
                    st.string,
                )
        # images / media
        for tag in soup.find_all(["img", "source", "video", "audio"]):
            for attr in ("src", "poster"):
                v = tag.get(attr)
                if v and not SKIP_HREF.match(v):
                    local = self.fetch_asset(context, urljoin(page_url, v))
                    if local:
                        tag[attr] = self.rel_prefix(depth) + local
            if tag.get("srcset"):
                parts = []
                for cand in tag["srcset"].split(","):
                    bits = cand.strip().split()
                    if not bits:
                        continue
                    local = self.fetch_asset(context, urljoin(page_url, bits[0]))
                    if local:
                        bits[0] = self.rel_prefix(depth) + local
                        parts.append(" ".join(bits))
                tag["srcset"] = ", ".join(parts) if parts else None
                if not parts:
                    del tag["srcset"]
        for tag in soup.find_all("link", rel=lambda r: r and ("icon" in r)):
            href = tag.get("href")
            if href and not SKIP_HREF.match(href):
                local = self.fetch_asset(context, urljoin(page_url, href))
                if local:
                    tag["href"] = self.rel_prefix(depth) + local
        # same-origin anchors -> relative snapshot paths.
        # depth counts the role folder + route segments, so rel_prefix(depth) is the app root (<out>/).
        app_root = self.rel_prefix(depth)
        for a in soup.find_all("a", href=True):
            href = a["href"]
            if SKIP_HREF.match(href):
                continue
            abs_u = urljoin(page_url, href)
            norm = self.normalize(abs_u)
            if norm is None:
                if urlparse(abs_u).netloc == self.origin:
                    a["href"] = "#"
                    a["data-demo-dead"] = "1"
                continue
            target_role = self.route_role(norm, role)
            rd = self.rdir(norm, target_role)
            a["href"] = app_root + target_role["name"] + "/" + (rd + "/" if rd else "")
        # login form -> jump into the configured role
        lf_role = self.cfg.get("login_form_role")
        if lf_role:
            for form in soup.find_all("form"):
                if form.find("input", attrs={"type": "password"}):
                    tr = next(r for r in self.roles if r["name"] == lf_role)
                    lrd = self.rdir(tr["landing"], tr)
                    form["data-demo-href"] = app_root + tr["name"] + "/" + (lrd + "/" if lrd else "")
        # config "stamp": hrefs are app-root relative, e.g. "admin/events/"
        for sel_cfg in self.cfg.get("stamp", []):
            for el in soup.select(sel_cfg["selector"]):
                el["data-demo-href"] = app_root + sel_cfg["href"].lstrip("/")
        # banner + shared css/js
        head = soup.head or soup.new_tag("head")
        if not soup.head:
            soup.html.insert(0, head)
        for m in head.find_all("meta", attrs={"http-equiv": True}):
            m.decompose()
        base_tag = head.find("base")
        if base_tag:
            base_tag.decompose()
        shared = app_root + "../_shared/"
        css = soup.new_tag("link", rel="stylesheet", href=shared + "demo.css")
        head.append(css)
        body = soup.body or soup.new_tag("body")
        banner = BeautifulSoup(self.banner_html(role, depth), "html.parser")
        body.insert(0, banner)
        js = soup.new_tag("script", src=shared + "demo.js", defer="")
        body.append(js)
        return str(soup)

    def _inline_url(self, context, m, page_url, depth):
        raw = m.group(2).strip()
        if SKIP_HREF.match(raw):
            return m.group(0)
        local = self.fetch_asset(context, urljoin(page_url, raw))
        if not local:
            return m.group(0)
        return f"url({m.group(1)}{self.rel_prefix(depth)}{local}{m.group(1)})"

    def route_role(self, route: str, current: dict) -> dict:
        """Pick which role's tree owns a route (by prefix), defaulting to current."""
        best = None
        for r in self.roles:
            for pre in r.get("owns", []):
                if route.startswith(pre) and (best is None or len(pre) > best[0]):
                    best = (len(pre), r)
        return best[1] if best else current

    def banner_html(self, role: dict, depth: int) -> str:
        up = self.rel_prefix(depth)  # app root (<out>/)
        links = []
        for r in self.roles:
            cls = "nb-active" if r["name"] == role["name"] else ""
            landing = self.rdir(r["landing"], r)
            href = up + r["name"] + "/" + (landing + "/" if landing else "")
            links.append(f'<a class="{cls}" href="{href}">{r.get("label", r["name"].title())}</a>')
        title = self.cfg.get("title", self.cfg["slug"])
        return (
            '<div id="nb-demo-banner">'
            '<span class="nb-tag">Static demo</span>'
            f'<span class="nb-msg"><b>{title}</b> — test site with fake data and no backend. Forms won’t submit; click around to explore.</span>'
            f'<span class="nb-links">{"".join(links)}'
            f'<a class="nb-home" href="{up}../../">← Portfolio</a></span>'
            "</div>"
        )

    # ---------- crawl ----------
    def run(self):
        with sync_playwright() as p:
            browser = p.chromium.launch()
            for role in self.roles:
                self.crawl_role(browser, role)
            browser.close()
        print(f"done: {self.pages_written} pages, {len(self.asset_cache)} assets -> {self.out}")

    def crawl_role(self, browser, role: dict):
        ctx = browser.new_context(viewport=self.viewport, ignore_https_errors=True)
        page = ctx.new_page()
        page.set_default_timeout(30000)
        if role.get("init_script"):
            ctx.add_init_script(role["init_script"])
        if role.get("login"):
            lg = role["login"]
            page.goto(self.base + lg["url"], wait_until="networkidle")
            for sel, val in lg["fill"].items():
                page.fill(sel, val)
            with page.expect_navigation(wait_until="networkidle", timeout=30000):
                page.click(lg.get("submit", 'button[type="submit"]'))
            if lg.get("expect_url") and lg["expect_url"] not in page.url:
                raise SystemExit(f"[{role['name']}] login failed, at {page.url}")
            print(f"[{role['name']}] logged in -> {page.url}")
        queue = deque()
        seen = set()
        for s in [role["landing"]] + role.get("seeds", []):
            n = self.normalize(urljoin(self.base + "/", s))
            if n and n not in seen:
                seen.add(n)
                queue.append(n)
        out_role = self.out / role["name"]
        count = 0
        while queue and count < self.max_pages:
            route = queue.popleft()
            try:
                resp = page.goto(self.base + route, wait_until="networkidle")
            except Exception as e:
                print(f"  ! {route}: {e.__class__.__name__}")
                continue
            page.wait_for_timeout(self.cfg.get("settle_ms", 500))
            final = self.normalize(page.url) or route
            if resp is not None and resp.status >= 400:
                print(f"  ! {route}: HTTP {resp.status}")
                continue
            if final != route and self.route_role(final, role)["name"] != role["name"]:
                print(f"  ~ {route} redirected out of role -> {final}, skipped")
                continue
            for h in page.eval_on_selector_all("a[href]", "els => els.map(e => e.href)"):
                n = self.normalize(h)
                if n and n not in seen and self.route_role(n, role)["name"] == role["name"]:
                    seen.add(n)
                    queue.append(n)
            self.save_page(ctx, page, out_role, route, role)
            count += 1
            for syn in role.get("synthetic", []):
                if syn.get("path", role["landing"]) != route:
                    continue
                try:
                    page.click(syn["click"])
                    page.wait_for_timeout(syn.get("wait", 800))
                    self.save_page(ctx, page, out_role, syn["save_as"], role)
                    count += 1
                    page.goto(self.base + route, wait_until="networkidle")
                except Exception as e:
                    print(f"  ! synthetic {syn['save_as']}: {e}")
        print(f"[{role['name']}] {count} pages")
        ctx.close()

    def save_page(self, ctx, page, out_role: Path, route: str, role: dict):
        rd = self.rdir(route, role)
        dest_dir = out_role / rd if rd else out_role
        dest_dir.mkdir(parents=True, exist_ok=True)
        depth = len([p for p in rd.split("/") if p]) + 1  # +1 for the role folder
        html = page.content()
        html = self.process_html(ctx, html, page.url, role, depth)
        (dest_dir / "index.html").write_text(html, encoding="utf-8")
        self.pages_written += 1
        print(f"  + {role['name']}/{rd or ''}")


def main():
    if len(sys.argv) != 2:
        print(__doc__)
        return 2
    cfg = json.loads(Path(sys.argv[1]).read_text())
    t0 = time.time()
    Snapshotter(cfg).run()
    print(f"{time.time() - t0:.1f}s")
    return 0


if __name__ == "__main__":
    sys.exit(main())
