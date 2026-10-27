const express = require('express');
const router = express.Router();
const handler = require('../lib/handlers/lyrics');
router.all('/', (req, res) => handler(req, res));
module.exports = router;
