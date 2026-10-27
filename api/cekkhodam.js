const express = require('express');
const router = express.Router();
const khodamList = require('./cekkhodamarray');

router.get('/', async (req, res) => {
    const nama = req.query.nama;
    if (!nama) return res.status(400).json({ status: 400, message: 'Please provide the name parameter.' });

    const random = khodamList[Math.floor(Math.random() * khodamList.length)];
    const hasil = `Khodam for ${nama} is ${random}`;

    res.json({ status: 200, result: hasil });
});

module.exports = router;