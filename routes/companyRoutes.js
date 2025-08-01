const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');

// POST /api/companies
// Create a new company
router.post('/', companyController.createCompany);

module.exports = router;
