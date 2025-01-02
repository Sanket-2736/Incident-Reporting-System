// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const { createReport, updateReport } = require('../controllers/reportController'); // Adjust the path as necessary

// Route for creating a new report
router.post('/reports', createReport); // POST request to create a new report

// Route for updating an existing report
router.post('/reports/update/:id', updateReport); // Change from PUT to POST for updating a report

module.exports = router;
