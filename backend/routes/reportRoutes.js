const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController'); // Adjust the path as necessary
const {protect} = require('../middlewares/authMiddleware')
const responderMiddleware = require('../middlewares/responderMiddleware')
// Define your routes
router.post('/report', protect, responderMiddleware, reportController.createReport); // Ensure createReport is defined and imported
router.get('/get-reports',protect, reportController.getReports);
router.get('/get-report-by-id/:id', reportController.getReportById);
router.post('/update/:id', protect, responderMiddleware, reportController.updateReport);

module.exports = router;
