const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// POST /api/products
// Create a new product and initial inventory
router.post('/', productController.createProduct);

module.exports = router;
