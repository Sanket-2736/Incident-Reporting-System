const express = require('express');
const router = express.Router();
const {login, signup} = require('../controllers/authControllers')

router.post('/login', login);

router.post('/register', signup);

module.exports = router;