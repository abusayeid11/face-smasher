# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the Project

No build tools or package manager. Open `index.html` directly in a browser, or serve with any static file server:

```bash
npx serve .
# or
python3 -m http.server
```

`upload.html` is a standalone Cloudinary upload widget that redirects to `index.html?faceUrl=<url>` after a successful upload.

## Architecture

All JS uses native ES modules (`type="module"`). There are three HTML entry points, each with its own JS entry:

| Page | Script | Purpose |
|---|---|---|
| `index.html` | `js/creator.js` | Creator/SaaS page: upload face + bg, save to Firebase, share link |
| `play.html` | `js/play.js` | Player page: loads game from `?g=` param, no setup UI |
| `upload.html` | inline script | Cloudinary-only upload, redirects to `index.html?faceUrl=` |

`script.js` is a standalone game entry (no SaaS flow; local file upload + arena picker).

**Module responsibilities:**
- `js/creator.js` — Cloudinary widgets, Firebase save/history, commentary system (SVG burst animations on hit/miss), live game preview
- `js/play.js` — player entry point; fetches game from Firebase, applies bg, starts game immediately
- `js/firebase.js` — Firebase init (Realtime DB), `saveGame(faceUrl, bgUrl) → shortId`, `getGame(id) → {faceUrl, bgUrl}`, `deleteGame(id)`
- `js/face.js` — face image state (`face` object), loading from file/URL/default SVG, position reset, scale updates
- `js/tool.js` — tool image state (`tool` object), preloads all 3 tool images on init, selection UI
- `js/game.js` — `requestAnimationFrame` render loop, hit detection, score, speed acceleration, screen shake
- `js/marks.js` — bruise mark generation (`createMark`) and drawing (`drawMark`); each tool has its own `BRUISE_PATTERNS` entry defining sizes, colors, blood/vessel counts
- `js/audio.js` — Web Audio API, unlocked on first user interaction
- `js/input.js` — mouse/touch position tracking, normalizes coordinates to canvas space
- `gamePlayArea/areas.js` — static arena definitions + auto-generates entries from `gamePlayArea/arenas/` image files

**Key data flows:**
- Face position lives in `face.{x,y}` (mutable); `resetFacePosition(canvas)` randomizes it
- Marks accumulate in `face.marks[]` (array of mark objects); cleared on score reset or new face load
- `tool.smashAnim` (0–1 float) drives the tool swing animation in the render loop; set to 1 on click
- Arena backgrounds are CSS-driven: canvas gets a class (e.g. `arena-candy`) and optionally a `--arena-photo` CSS variable for photo arenas
- User-added arenas are persisted to `localStorage` under key `faceSmasherArenaPhotos` as JSON with base64 data URLs
- Creator game history is persisted to `localStorage` under key `faceSmasherGameHistory`

**SaaS flow:**
- `index.html` — creator page: two Cloudinary upload widgets (face + bg), saves both URLs to Firebase Realtime DB under `games/{shortId}`, displays a `play.html?g={shortId}` share link + WhatsApp/Twitter/Facebook share buttons
- `play.html` — player page: reads `?g=` param, fetches `{ faceUrl, bgUrl }` from Firebase, applies background via `--arena-photo` CSS variable + `arena-photo` canvas class, loads face via `loadFaceFromUrl`, starts game immediately

**Cloudinary:** cloud name `do088rioa`, upload preset `face_smash`
**Firebase project:** `heart-4367c`, Realtime DB at `https://heart-4367c-default-rtdb.firebaseio.com`
**DB schema:** `games/{7-char-id}/{ faceUrl, bgUrl, createdAt }`

## Adding a New Tool

1. Add the tool image to `tools/`
2. Register it in `js/tool.js` (`toolImages` object + load in `loadTools`)
3. Add a `BRUISE_PATTERNS` entry in `js/marks.js` (fallback is `punch` pattern)
4. Add a button in `index.html` with `data-tool="<name>"`

## Adding a New Arena

Add a PNG/JPG to `gamePlayArea/arenas/` and register the filename in the `folderArenaFiles` array in `gamePlayArea/areas.js`. CSS arena classes (non-photo arenas) are defined in `style.css`.
