const express = require('express');
const lorController = require('../controllers/lorController');
const router = express.Router();

router.post('/', lorController.submitLoR);
router.get('/:role', lorController.getLoRs);

module.exports = router;
