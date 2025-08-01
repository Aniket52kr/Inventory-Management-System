const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// @route   POST /api/products
// @desc    Create a new product and initial inventory
// @access  Public or Protected (depending on future auth)
router.post('/', productController.createProduct);

module.exports = router;
