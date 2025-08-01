const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

// @route   GET /api/companies/:company_id/alerts/low-stock
// @desc    Get low stock alerts for a company
// @access  Public or Protected (depending on future auth)
router.get('/companies/:company_id/alerts/low-stock', alertController.getLowStockAlerts);

module.exports = router;
