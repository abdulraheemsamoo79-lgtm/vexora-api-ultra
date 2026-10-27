# VEXORA API — Ultra

A fast, free REST API with **31 tested endpoints**: downloaders (TikTok, YouTube, Instagram, Facebook, X, Spotify, CapCut, Drive, MediaFire, Pinterest), search (YouTube, TikTok, APK, NPM, web, WhatsApp groups, GitHub), and tools (screenshot, QR, translate, weather, lyrics, ATTP stickers, news).

Every endpoint in this repo was **live-tested** — if it is listed, it works.

## Run it

```bash
npm install
node index.js        # http://localhost:3000
```

On Vercel it deploys as-is (see `vercel.json`).

## API keys & limits

Every endpoint (except `/api/ping`) needs a key: `?apikey=YOUR_KEY`.

- **Users** get a free key (100 requests/day) at `/getkey`.
- **Admins** manage keys, limits, bans and stats at `/admin`.
- Daily limits reset at midnight Pakistan time. Responses carry
  `X-RateLimit-Limit / Used / Remaining` headers.
- Set `OWNER_API_KEY` for an unlimited owner key.

Key data lives in Vercel KV (Upstash) in production — connect a KV
store to the project so the `KV_REST_API_*` env vars appear. Locally
it falls back to `data/keystore.json`.

## Environment

| Variable | Needed for |
|---|---|
| `APIFY_TOKEN` | Instagram / Facebook / YouTube audio-video backends |
| `APIFY_TOKEN_YT` | Optional — separate Apify account for YouTube only |
| `ADMIN_USER` / `ADMIN_PASS` | Admin panel login (`/admin`) |
| `OWNER_API_KEY` | Optional — unlimited master key for the owner |
| `DEFAULT_DAILY_LIMIT` | Optional — free-key daily limit (default 100) |

## Endpoints

Open the homepage after starting the server — it has a live tester for all 31 endpoints, and `/docs` has the full list.

---
Built with the VEXORA stack. Base structure credited to Arslan-MD's starter; all backends replaced, repaired and tested by the VEXORA API project.
