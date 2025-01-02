const express = require('express');
const router = express.Router();
const { createIncident, getIncidents } = require('../controllers/incidentController'); // Adjust path as necessary

// POST route for creating an incident
router.post('/', createIncident);

// GET route for fetching incidents
router.get('/', getIncidents);

module.exports = router;
