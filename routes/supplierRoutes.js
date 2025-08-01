const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

// @route   POST /api/suppliers
// @desc    Create a new supplier
router.post('/', supplierController.createSupplier);

module.exports = router;
