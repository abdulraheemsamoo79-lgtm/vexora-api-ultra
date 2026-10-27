/**
 * Key store — API keys, daily usage counters, endpoint stats.
 *
 * Do backends:
 *  1) Upstash Redis REST (Vercel KV) — jab KV_REST_API_URL +
 *     KV_REST_API_TOKEN (ya UPSTASH_REDIS_REST_URL/TOKEN) env mile.
 *     Production (Vercel) par yahi chalta hai.
 *  2) Local JSON file (data/keystore.json) — sirf local dev ke liye,
 *     Vercel par filesystem kalam hai is liye wahan KV zaroori hai.
 *
 * Data:
 *  - hash  "apikeys"        : apikey -> JSON {name, email, limit, banned, created}
 *  - key   "usage:<key>:<PKT-date>" -> daily counter (48h expiry)
 *  - hash  "stats:<PKT-date>"       : endpoint -> count
 */

const fs = require('fs');
const path = require('path');

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';
const USE_KV = !!(KV_URL && KV_TOKEN);

const FILE = path.join(__dirname, '..', 'data', 'keystore.json');
let mem = null;

function loadFile() {
    if (mem) return mem;
    try {
        mem = JSON.parse(fs.readFileSync(FILE, 'utf8'));
    } catch (_) {
        mem = { keys: {}, usage: {}, stats: {} };
    }
    if (!mem.keys) mem.keys = {};
    if (!mem.usage) mem.usage = {};
    if (!mem.stats) mem.stats = {};
    return mem;
}

function saveFile() {
    try {
        fs.mkdirSync(path.dirname(FILE), { recursive: true });
        fs.writeFileSync(FILE, JSON.stringify(mem, null, 2));
    } catch (_) {}
}

async function kv(cmds) {
    // cmds: [[name, ...args], ...] -> results array
    const res = await fetch(KV_URL + '/pipeline', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + KV_TOKEN, 'Content-Type': 'application/json' },
        body: JSON.stringify(cmds.map(([command, ...args]) => [command, ...args.map(String)]))
    });
    if (!res.ok) throw new Error('KV HTTP ' + res.status);
    const data = await res.json();
    return data.map(d => d.result);
}

function todayPKT() {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Karachi' }).format(new Date());
}

// ---------- keys ----------

async function getKey(key) {
    if (!key) return null;
    if (USE_KV) {
        const [raw] = await kv([['HGET', 'apikeys', key]]);
        if (!raw) return null;
        try { return JSON.parse(raw); } catch (_) { return null; }
    }
    const m = loadFile();
    return m.keys[key] || null;
}

async function putKey(key, record) {
    if (USE_KV) {
        await kv([['HSET', 'apikeys', key, JSON.stringify(record)]]);
        return;
    }
    const m = loadFile();
    m.keys[key] = record;
    saveFile();
}

async function deleteKey(key) {
    if (USE_KV) {
        await kv([['HDEL', 'apikeys', key]]);
        return;
    }
    const m = loadFile();
    delete m.keys[key];
    saveFile();
}

async function listKeys() {
    if (USE_KV) {
        const [all] = await kv([['HGETALL', 'apikeys']]);
        const out = [];
        if (Array.isArray(all)) {
            for (let i = 0; i < all.length; i += 2) {
                try { out.push({ key: all[i], ...JSON.parse(all[i + 1]) }); } catch (_) {}
            }
        }
        return out;
    }
    const m = loadFile();
    return Object.entries(m.keys).map(([key, r]) => ({ key, ...r }));
}

async function findKeyByEmail(email) {
    const all = await listKeys();
    return all.find(k => (k.email || '').toLowerCase() === String(email).toLowerCase()) || null;
}

// ---------- usage / stats ----------

async function incrUsage(key, endpoint) {
    const d = todayPKT();
    if (USE_KV) {
        const [count] = await kv([
            ['INCR', `usage:${key}:${d}`],
            ['EXPIRE', `usage:${key}:${d}`, 172800],
            ['HINCRBY', `stats:${d}`, endpoint, 1],
            ['EXPIRE', `stats:${d}`, 604800]
        ]);
        return Number(count) || 0;
    }
    const m = loadFile();
    const uk = `${key}:${d}`;
    m.usage[uk] = (m.usage[uk] || 0) + 1;
    if (!m.stats[d]) m.stats[d] = {};
    m.stats[d][endpoint] = (m.stats[d][endpoint] || 0) + 1;
    saveFile();
    return m.usage[uk];
}

async function getUsage(key) {
    const d = todayPKT();
    if (USE_KV) {
        const [n] = await kv([['GET', `usage:${key}:${d}`]]);
        return Number(n) || 0;
    }
    const m = loadFile();
    return m.usage[`${key}:${d}`] || 0;
}

async function getStats() {
    const d = todayPKT();
    if (USE_KV) {
        const [ep, keys] = await kv([
            ['HGETALL', `stats:${d}`],
            ['HLEN', 'apikeys']
        ]);
        const perEndpoint = {};
        let total = 0;
        if (Array.isArray(ep)) {
            for (let i = 0; i < ep.length; i += 2) {
                perEndpoint[ep[i]] = Number(ep[i + 1]) || 0;
                total += perEndpoint[ep[i]];
            }
        }
        return { date: d, totalKeys: Number(keys) || 0, requestsToday: total, perEndpoint };
    }
    const m = loadFile();
    const perEndpoint = m.stats[d] || {};
    const total = Object.values(perEndpoint).reduce((a, b) => a + b, 0);
    return { date: d, totalKeys: Object.keys(m.keys).length, requestsToday: total, perEndpoint };
}

module.exports = {
    USE_KV, todayPKT,
    getKey, putKey, deleteKey, listKeys, findKeyByEmail,
    incrUsage, getUsage, getStats
};
