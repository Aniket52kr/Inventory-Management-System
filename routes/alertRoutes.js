const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

// GET /api/companies/:company_id/alerts/low-stock
// Get low stock alerts for a company
router.get('/companies/:company_id/alerts/low-stock', alertController.getLowStockAlerts);

module.exports = router;
