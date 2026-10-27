const express = require('express');
const axios = require('axios');
const router = express.Router();
const ytmp3 = require('../lib/handlers/ytmp3');

/**
 * GET /api/spotifydl?url=<spotify track url>
 * Spotify direct download ka koi free backend reliably nahi
 * chalta (sab live check kiye: fabdl 403, siputzx nodes down) —
 * is liye: oEmbed se title/thumbnail, embed page se artist,
 * phir apna hi ytmp3 handler (YouTube match) audio deta hai.
 * Result mein note saaf likha jata hai.
 */

function captureRes() {
    return {
        statusCode: 200, body: null,
        writeHead(code) { this.statusCode = code; },
        setHeader() {}, getHeader() { return undefined; },
        end(b) { this.body = b; }
    };
}

router.get('/', async (req, res) => {
    const url = String(req.query.url || '');
    if (!/open\.spotify\.com\/(intl-[a-z-]+\/)?track\/[A-Za-z0-9]+/.test(url)) {
        return res.status(400).json({ status: false, message: 'Valid Spotify track URL required: /api/spotifydl?url=<track url>' });
    }
    try {
        let title = '', artist = '', thumb = '';
        try {
            const oe = await axios.get('https://open.spotify.com/oembed', {
                params: { url: url.split('?')[0] },
                timeout: 20000,
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            title = oe.data?.title || '';
            thumb = oe.data?.thumbnail_url || '';
        } catch (_) {}
        try {
            const id = (url.match(/track\/([A-Za-z0-9]+)/) || [])[1];
            if (id) {
                const em = await axios.get('https://open.spotify.com/embed/track/' + id, {
                    timeout: 20000,
                    headers: { 'User-Agent': 'Mozilla/5.0' }
                });
                const mm = String(em.data).match(/"artists":\[\{"name":"([^"]+)"/);
                if (mm) artist = mm[1];
            }
        } catch (_) {}
        if (!title) {
            return res.json({ status: false, message: 'Spotify link could not be read' });
        }
        const fakeReq = {
            url: '/api/ytmp3?url=' + encodeURIComponent(`${title} ${artist}`.trim()),
            method: 'GET',
            headers: {}
        };
        const cap = captureRes();
        await ytmp3(fakeReq, cap);
        let data = null;
        try { data = JSON.parse(cap.body); } catch (_) {}
        if (!data?.status || !data?.result?.audio_download) {
            return res.json({ status: false, message: data?.message || 'Audio could not be resolved' });
        }
        return res.json({
            status: true,
            creator: 'VEXORA API',
            result: {
                title,
                artist,
                thumbnail: thumb,
                audio_download: data.result.audio_download,
                note: 'Audio matched from YouTube — Spotify does not provide direct downloads.'
            }
        });
    } catch (e) {
        return res.json({ status: false, message: 'Server error: ' + e.message });
    }
});

module.exports = router;
