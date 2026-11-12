# Hobo — Drift Social ✳

A social app without a feed. Your posts are **flares** — they drift across a living field, and other people catch them, echo them, or let them pass. No likes. No followers. Just drift.

## What it does

- ✳ **Drop a flare** — a text post, a doodle, or a mood-color burst
- 🌊 **Drift field** — flares float with gentle physics, wrapping around the world
- 🎯 **Catch** — tap a drifting flare to open it, keep it in your **pouch**
- ↩ **Echo** — send a reply back into the drift; echoes draw a visible trace line
- 🎨 **Themes** — night, day, and dream modes
- 👻 **Ghost flares** — the field is never empty, even solo
- 💾 **Zero backend** — everything persists in localStorage

## Run it

Open `index.html` in any browser, or serve with GitHub Pages. No build step, no dependencies.

## Structure

```
index.html
css/    style.css, themes.css
js/     app.js, drift-engine.js, flares.js, storage.js, ui.js
```

## Roadmap

- QR-share a single flare
- Real multi-user drift sync
- Remix flares (doodle on top of a caught flare)