const express = require('express');
const router = express.Router();
const { createIncident, getIncidents } = require('../controllers/incidentController'); // Adjust path as necessary
const {protect} = require('../middlewares/authMiddleware')
const adminMiddleware = require('../middlewares/adminMiddleware')
const responderMiddleware = require('../middlewares/responderMiddleware')

router.post('/create', protect, createIncident);
router.get('/list', protect, adminMiddleware , getIncidents);
router.get('/list-for-authority', protect, responderMiddleware, getIncidents);

module.exports = router;
