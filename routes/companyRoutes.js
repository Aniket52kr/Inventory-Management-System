const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');

// @route   POST /api/companies
// @desc    Create a new company
router.post('/', companyController.createCompany);

module.exports = router;
