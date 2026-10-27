# VEXORA API — Ultra

A fast, free REST API with **31 tested endpoints**: downloaders (TikTok, YouTube, Instagram, Facebook, X, Spotify, CapCut, Drive, MediaFire, Pinterest), search (YouTube, TikTok, APK, NPM, web, WhatsApp groups, GitHub), and tools (screenshot, QR, translate, weather, lyrics, ATTP stickers, news).

Every endpoint in this repo was **live-tested** — if it is listed, it works.

## Run it

```bash
npm install
node index.js        # http://localhost:3000
```

On Vercel it deploys as-is (see `vercel.json`).

## Environment

| Variable | Needed for |
|---|---|
| `APIFY_TOKEN` | Instagram / Facebook / YouTube audio-video backends |
| `APIFY_TOKEN_YT` | Optional — separate Apify account for YouTube only |

## Endpoints

Open the homepage after starting the server — it has a live tester for all 31 endpoints, and `/docs` has the full list.

---
Built with the VEXORA stack. Base structure credited to Arslan-MD's starter; all backends replaced, repaired and tested by the VEXORA API project.
