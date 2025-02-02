const protectRoute = require('../middleware/auth.middleware.js');
const authorityProtect = require('../middleware/authority.middleware.js')
const express = require('express');
const {viewIncidents, updateIncident, markIncidentAsSolved, getUser} = require('../controllers/authority.controllers.js')
const router = express.Router();

router.get('/view-incidents', protectRoute, authorityProtect, viewIncidents);
router.post('/update-incident/:id', protectRoute, authorityProtect, updateIncident);
router.post('/mark-resolved/:id', protectRoute, authorityProtect, markIncidentAsSolved);
router.get('/user/:id', getUser); 

module.exports = router;