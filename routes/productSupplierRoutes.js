const express = require('express');
const router = express.Router();
const productSupplierController = require('../controllers/productSupplierController');

// @route   POST /api/product-suppliers
// @desc    Link a product to a supplier
router.post('/', productSupplierController.linkProductToSupplier);

module.exports = router;
