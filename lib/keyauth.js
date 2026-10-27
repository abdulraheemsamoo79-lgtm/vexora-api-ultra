/**
 * API key system — auth middleware, self-register, admin API.
 *
 * - Har /api/* call (ping ke ilawa) ke liye ?apikey=... lazmi hai.
 * - Har key ki daily limit (Pakistan time par reset) hoti hai;
 *   limit -1 = unlimited (owner/premium).
 * - OWNER_API_KEY env wali key hamesha unlimited owner key hai.
 * - Admin login ADMIN_USER / ADMIN_PASS env se; session ek
 *   signed cookie mein rehta hai (server par kuch store nahi).
 */

const crypto = require('crypto');
const store = require('./keystore');

const DEFAULT_LIMIT = parseInt(process.env.DEFAULT_DAILY_LIMIT || '100', 10);

function genKey() {
    return 'vx-' + crypto.randomBytes(12).toString('hex'); // vx- + 24 hex chars
}

function fail(res, code, message, extra = {}) {
    return res.status(code).json({ status: false, creator: 'VEXORA API', message, ...extra });
}

// ---------- auth middleware ----------

async function keyAuth(req, res, next) {
    try {
        const provided = req.query.apikey || req.headers['x-api-key'] || '';
        const endpoint = (req.path || '').replace(/^\//, '').split('/')[0] || 'unknown';

        if (!provided) {
            return fail(res, 401, 'API key required. Get your free key: /getkey', { example: '/api/ttdl?url=...&apikey=YOUR_KEY' });
        }

        // Owner master key (env) — hamesha unlimited
        if (process.env.OWNER_API_KEY && provided === process.env.OWNER_API_KEY) {
            res.set('X-RateLimit-Limit', 'unlimited');
            store.incrUsage('OWNER', endpoint).catch(() => {});
            return next();
        }

        const record = await store.getKey(provided);
        if (!record) return fail(res, 403, 'Invalid API key. Get your free key: /getkey');
        if (record.banned) return fail(res, 403, 'This API key has been suspended by the admin.');

        const limit = typeof record.limit === 'number' ? record.limit : DEFAULT_LIMIT;
        const used = await store.getUsage(provided);
        if (limit >= 0 && used >= limit) {
            return fail(res, 429, 'Daily limit exceeded for this API key. Limit resets at midnight (Pakistan time).', { limit, used });
        }

        const newUsed = await store.incrUsage(provided, endpoint);
        if (limit >= 0) {
            res.set('X-RateLimit-Limit', String(limit));
            res.set('X-RateLimit-Used', String(newUsed));
            res.set('X-RateLimit-Remaining', String(Math.max(0, limit - newUsed)));
        } else {
            res.set('X-RateLimit-Limit', 'unlimited');
        }
        return next();
    } catch (e) {
        return fail(res, 500, 'Key check failed: ' + e.message);
    }
}

// ---------- public register ----------

async function register(req, res) {
    try {
        const { name, email } = req.body || {};
        const cleanName = String(name || '').trim().slice(0, 60);
        const cleanEmail = String(email || '').trim().toLowerCase().slice(0, 120);
        if (cleanName.length < 2) return fail(res, 400, 'Please enter your name.');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return fail(res, 400, 'Please enter a valid email address.');

        const existing = await store.findKeyByEmail(cleanEmail);
        if (existing) {
            return fail(res, 409, 'This email is already registered. If you lost your key, contact the admin.');
        }

        const key = genKey();
        await store.putKey(key, {
            name: cleanName,
            email: cleanEmail,
            limit: DEFAULT_LIMIT,
            banned: false,
            created: new Date().toISOString()
        });
        return res.json({
            status: true,
            creator: 'VEXORA API',
            message: 'Your free API key is ready. Save it — it is shown only once.',
            apikey: key,
            limit: DEFAULT_LIMIT,
            usage: 'Add &apikey=' + key + ' to any endpoint URL, e.g. /api/ytsearch?q=phonk&apikey=' + key
        });
    } catch (e) {
        return fail(res, 500, 'Register failed: ' + e.message);
    }
}

// ---------- admin session ----------

function adminToken() {
    const pass = process.env.ADMIN_PASS || '';
    return crypto.createHmac('sha256', pass || 'unset').update('vexora-admin-session').digest('hex');
}

function isAdmin(req) {
    if (!process.env.ADMIN_USER || !process.env.ADMIN_PASS) return false;
    const cookie = String(req.headers.cookie || '');
    const m = cookie.match(/(?:^|;\s*)vxadmin=([a-f0-9]{64})/);
    return !!m && m[1] === adminToken();
}

function adminLogin(req, res) {
    const { user, pass } = req.body || {};
    if (!process.env.ADMIN_USER || !process.env.ADMIN_PASS) {
        return fail(res, 500, 'Admin login is not configured yet (ADMIN_USER / ADMIN_PASS env missing).');
    }
    if (user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS) {
        res.set('Set-Cookie', `vxadmin=${adminToken()}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax`);
        return res.json({ status: true, message: 'Welcome back, admin.' });
    }
    return fail(res, 401, 'Wrong username or password.');
}

function requireAdmin(req, res, next) {
    if (!isAdmin(req)) return fail(res, 401, 'Admin login required.');
    return next();
}

// ---------- admin API ----------

async function adminListKeys(req, res) {
    try {
        const keys = await store.listKeys();
        const withUsage = await Promise.all(keys.map(async k => ({ ...k, usedToday: await store.getUsage(k.key) })));
        withUsage.sort((a, b) => String(a.created || '').localeCompare(String(b.created || '')));
        return res.json({ status: true, keys: withUsage });
    } catch (e) {
        return fail(res, 500, e.message);
    }
}

async function adminCreateKey(req, res) {
    try {
        const { name, email, limit } = req.body || {};
        const lim = limit === -1 || limit === '-1' ? -1 : Math.max(1, parseInt(limit, 10) || DEFAULT_LIMIT);
        const key = genKey();
        await store.putKey(key, {
            name: String(name || 'Manual key').slice(0, 60),
            email: String(email || '').slice(0, 120),
            limit: lim,
            banned: false,
            created: new Date().toISOString()
        });
        return res.json({ status: true, apikey: key, limit: lim });
    } catch (e) {
        return fail(res, 500, e.message);
    }
}

async function adminUpdateKey(req, res) {
    try {
        const key = req.params.key;
        const record = await store.getKey(key);
        if (!record) return fail(res, 404, 'Key not found.');
        const { limit, banned, name } = req.body || {};
        if (limit !== undefined) record.limit = limit === -1 || limit === '-1' ? -1 : Math.max(1, parseInt(limit, 10) || DEFAULT_LIMIT);
        if (banned !== undefined) record.banned = !!banned;
        if (name !== undefined) record.name = String(name).slice(0, 60);
        await store.putKey(key, record);
        return res.json({ status: true, key, ...record });
    } catch (e) {
        return fail(res, 500, e.message);
    }
}

async function adminDeleteKey(req, res) {
    try {
        await store.deleteKey(req.params.key);
        return res.json({ status: true, message: 'Key deleted.' });
    } catch (e) {
        return fail(res, 500, e.message);
    }
}

async function adminStats(req, res) {
    try {
        const s = await store.getStats();
        return res.json({ status: true, storage: store.USE_KV ? 'Vercel KV' : 'local file', ...s });
    } catch (e) {
        return fail(res, 500, e.message);
    }
}

module.exports = {
    keyAuth, register,
    adminLogin, requireAdmin, adminListKeys, adminCreateKey, adminUpdateKey, adminDeleteKey, adminStats,
    DEFAULT_LIMIT
};
