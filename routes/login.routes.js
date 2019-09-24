const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authentication');
const loginController = require('../controllers/login.controller');

// ==================================================
// Autenticacion de google
// ==================================================
router.post('/google', loginController.googleAuthentication);


// ==================================================
// Autenticacion normal
// ==================================================
router.post('/', loginController.login);

// ==================================================
// Renovar Token
// ==================================================
router.get('/reloadToken', verifyToken, loginController.realoadToken);

module.exports = router;