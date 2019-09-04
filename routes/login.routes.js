const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login.controller');

// ==================================================
// Autenticacion de google
// ==================================================
router.post('/google', loginController.googleAuthentication);


// ==================================================
// Autenticacion normal
// ==================================================
router.post('/', loginController.authentication);

module.exports = router;