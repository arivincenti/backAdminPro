const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login.controller');

router.post('/', loginController.authentication);

module.exports = router;