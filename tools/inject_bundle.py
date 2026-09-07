#!/usr/bin/env python3
"""Inject a slim 'live demo' banner into a functional bundle's index.html.
Usage: inject_bundle.py <html_file> <depth_to_demo_root> "<Title>" "<message>"
depth: number of '../' to reach demo/ (e.g. relativity-train/index.html -> 1; rotlang/play/ -> 2)
Idempotent: re-running replaces the banner.
"""
import sys
from pathlib import Path

from bs4 import BeautifulSoup

f = Path(sys.argv[1])
depth = int(sys.argv[2])
title = sys.argv[3]
msg = sys.argv[4]
up = "../" * depth  # to demo/
shared = up + "_shared/"

soup = BeautifulSoup(f.read_text(encoding="utf-8"), "html.parser")
for old in soup.select("#nb-demo-banner"):
    old.decompose()
for old in soup.select("link[data-nb]"):
    old.decompose()

head = soup.head
if head is None:
    head = soup.new_tag("head")
    (soup.html or soup).insert(0, head)
link = soup.new_tag("link", rel="stylesheet", href=shared + "demo.css")
link["data-nb"] = "1"
head.append(link)

banner = soup.new_tag("div", id="nb-demo-banner")
banner["class"] = "nb-live"
banner.append(BeautifulSoup(
    '<span class="nb-tag">Live demo</span>'
    f'<span class="nb-msg"><b>{title}</b> — {msg}</span>'
    f'<span class="nb-links"><a class="nb-home" href="{up}">All demos</a>'
    f'<a class="nb-home" href="{up}../">← Portfolio</a></span>',
    "html.parser",
))
body = soup.body or soup
body.insert(0, banner)
f.write_text(str(soup), encoding="utf-8")
print(f"injected banner -> {f}")
