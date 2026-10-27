const express = require('express');
const router = express.Router();
const ytmp3 = require('../lib/handlers/ytmp3');
const ytmp4 = require('../lib/handlers/ytmp4');
// /api/ytdl?url=<yt url>&type=mp3|mp4 (default mp4)
router.get('/', (req, res) => {
    const type = String(req.query.type || 'mp4').toLowerCase();
    return (type === 'mp3' ? ytmp3 : ytmp4)(req, res);
});
module.exports = router;
