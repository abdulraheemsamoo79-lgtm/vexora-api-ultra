const express = require('express');
const router = express.Router();
const handler = require('../lib/handlers/fbdl');
router.all('/', (req, res) => handler(req, res));
module.exports = router;
