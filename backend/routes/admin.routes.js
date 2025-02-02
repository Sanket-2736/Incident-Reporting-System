const protectRoute = require('../middleware/auth.middleware.js');
const adminProtect = require('../middleware/admin.middleware.js');
const RegisteredUser = require('../models/registeredUsers.model.js');
const User = require('../models/user.model.js')
const express = require('express');
const router = express.Router();
const { removeUser, viewRegistrations, verify} = require('../controllers/admin.controllers.js');
const {viewIncidents} = require('../controllers/authority.controllers.js');

router.post('/verify/:id', protectRoute, adminProtect, verify);
router.put('/remove-user', protectRoute, adminProtect, removeUser);
router.post('/view-incidents', protectRoute, adminProtect, viewIncidents);
router.get('/view-registrations', protectRoute, viewRegistrations, viewIncidents);

module.exports = router;