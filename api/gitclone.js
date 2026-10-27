const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/', async (req, res) => {
    let { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'Example repository URL. Example: /gitclone?url=https://github.com/abdulraheemsamoo79-lgtm/vexora-pair' });
    }

    let regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i;
    if (!regex.test(url)) {
        return res.status(400).json({ error: 'Invalid link!' });
    }

    try {
        let [, user, repo] = url.match(regex);
        repo = repo.replace(/.git$/, '');
        let apiUrl = `https://api.github.com/repos/${user}/${repo}/zipball`;

        let response = await axios.head(apiUrl);
        let contentDisposition = response.headers['content-disposition'];
        let filename = contentDisposition.match(/attachment; filename=(.*)/)[1];

        res.json({
            success: true,
            repository: `${user}/${repo}`,
            download_url: apiUrl,
            filename: filename
        });
    } catch (error) {
        res.status(500).json({ error: 'Repository not found.', details: error.message });
    }
});

module.exports = router;