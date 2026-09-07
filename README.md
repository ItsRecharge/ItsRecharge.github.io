# itsrecharge.github.io

Personal site for **Neel Bansal**, served at <https://itsrecharge.github.io/>.

A single-page portfolio plus a `demo/` folder of runnable and static demos of each project.

## Layout

- `index.html`, `styles.css`, `main.js` — the portfolio page. Project data lives in `main.js`.
- `assets/img/<slug>/` — optimized screenshots (WebP).
- `demo/` — one folder per project:
  - **Functional bundles** (run in the browser): `relativity-train/`, `humscore/`, `rotlang/`, `freshline/`.
  - **Static click-through demos** (rendered pages, fake data, no backend): `trim-hours/`, `nhs-hours/`,
    `instrument-tracking/`, `drummajor/`, `safetyboston/`, plus interactive `*/mock/` pages where upstream provides them.
  - `_shared/` — the demo banner + `demo.js` shared by static snapshots.
- `tools/` — the reproducible pipeline used to build the demos:
  - `snapshot.py` — logs into a running app, crawls it, and freezes each page as static HTML
    (scripts stripped, assets localized, banner injected). Per-app config in `tools/apps/*.json`.
  - `snapshot_bs.py` — bespoke capture for the SafetyBoston SPA (React-state tabs).
  - `seeds/` — fake-data seed scripts (no real student data).
  - `optimize_images.py`, `inject_bundle.py`, `verify.py`, `shots_bundles.py`.

## Rebuilding the demos

Each demo was produced by cloning the source repo, seeding it with **fictional** data, running it locally,
and snapshotting it. See `tools/apps/<slug>.json` for the exact routes and login flow, and `tools/seeds/`
for the data. All demo accounts, names, schools, and coordinates are made up.

## Notes

- Static demos carry a banner: forms don't submit and there's no backend.
- The LinkedIn badge in the About section falls back to a styled link if LinkedIn's script is blocked.
