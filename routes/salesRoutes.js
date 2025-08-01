const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

// POST /api/sales
// Record a product sale
router.post('/', salesController.recordSale);

module.exports = router;
