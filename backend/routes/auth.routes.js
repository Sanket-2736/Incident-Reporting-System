const protectRoute = require('../middleware/auth.middleware.js');
const express = require('express');
const router = express.Router();
const {login, signup, reportIncident, viewReport, viewIncident, updateProfile, checkApproval, adminSignUp, getNotifications, logout, authoritySignUp} = require('../controllers/auth.controller.js');

router.post('/login', login);
router.post('/admin-signup', adminSignUp);
router.post('/authority-signup', authoritySignUp);
router.post('/logout', logout);
router.post('/signup', signup);
router.post('/check-approval', checkApproval);
router.post('/report-incident', protectRoute, reportIncident);
router.put('/update-profile', protectRoute, updateProfile);
router.get('/notifications', protectRoute, getNotifications);
router.get('/view-incident/:id', protectRoute, viewIncident);
router.get('/view-report/:id', protectRoute, viewReport);

module.exports = router;