const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

// POST /api/suppliers
// Create a new supplier
router.post('/', supplierController.createSupplier);

module.exports = router;
