const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const router = express.Router();

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9'
};

function cleanLink(href) {
    if (!href) return href;
    try {
        const u = new URL(href.startsWith('//') ? 'https:' + href : href);
        const uddg = u.searchParams.get('uddg');
        if (uddg) return decodeURIComponent(uddg);
        return u.href;
    } catch (_) {
        return href;
    }
}

// Primary: Bing search — Vercel jaisi datacenter IPs par bhi chalta
// hai, jabke DuckDuckGo (html + lite dono) unhein 403/202 deta hai.
async function viaBing(query) {
    const { data: html } = await axios.get('https://www.bing.com/search', {
        params: { q: query }, headers: HEADERS, timeout: 20000
    });
    const $ = cheerio.load(html);
    const results = [];
    $('li.b_algo h2 a').each((_, el) => {
        const title = $(el).text().trim();
        let link = $(el).attr('href');
        try {
            const u = new URL(link).searchParams.get('u');
            if (u && u.startsWith('a1')) link = Buffer.from(u.slice(2), 'base64').toString('utf8');
        } catch (_) {}
        if (title && link) results.push({ title, link });
    });
    return results;
}

async function viaLite(query) {
    const { data: html } = await axios.get('https://lite.duckduckgo.com/lite/', {
        params: { q: query }, headers: HEADERS, timeout: 20000
    });
    const $ = cheerio.load(html);
    const results = [];
    $('a.result-link').each((_, el) => {
        const title = $(el).text().trim();
        const link = cleanLink($(el).attr('href'));
        if (title && link) results.push({ title, link });
    });
    return results;
}

async function viaHtml(query) {
    const { data: html } = await axios.get('https://html.duckduckgo.com/html/', {
        params: { q: query }, headers: HEADERS, timeout: 20000
    });
    const $ = cheerio.load(html);
    const results = [];
    $('.result__title').each((_, el) => {
        const title = $(el).text().trim();
        const link = cleanLink($(el).find('a').attr('href'));
        if (title && link) results.push({ title, link });
    });
    return results;
}

router.get('/', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ status: 400, message: 'Parameter q is required.' });

    try {
        let results = await viaBing(query).catch(() => []);
        if (!results.length) results = await viaLite(query).catch(() => []);
        if (!results.length) results = await viaHtml(query).catch(() => []);
        if (!results.length) {
            return res.status(500).json({ status: 500, message: 'Failed to fetch data.', error: 'No results from search backends' });
        }
        return res.json({ status: 200, results });
    } catch (err) {
        return res.status(500).json({ status: 500, message: 'Failed to fetch data.', error: err.message });
    }
});

module.exports = router;
