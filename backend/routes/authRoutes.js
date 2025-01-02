const express = require('express');
const router = express.Router();
const { login, signup, getUserByUsername } = require('../controllers/authControllers');

router.post('/login', login);
router.post('/register', signup);
router.get('/get-user/:username', getUserByUsername); // Change POST to GET for fetching user

module.exports = router;
