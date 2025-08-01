const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouseController');

// POST /api/warehouses
// Create a new warehouse
router.post('/', warehouseController.createWarehouse);

module.exports = router;
