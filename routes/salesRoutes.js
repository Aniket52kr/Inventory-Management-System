const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

// @route   POST /api/sales
// @desc    Record a product sale
router.post('/', salesController.recordSale);

module.exports = router;
