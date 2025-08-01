const express = require('express');
const router = express.Router();
const productSupplierController = require('../controllers/productSupplierController');

// POST /api/product-suppliers
// Link a product to a supplier
router.post('/', productSupplierController.linkProductToSupplier);

module.exports = router;
