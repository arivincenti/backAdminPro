const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdminOrMyself } = require('../middlewares/authentication');
const userController = require('../controllers/user.controller');

// ==================================================
// Obtener todos los usuarios
// ==================================================

router.get('/', verifyToken, userController.getUsers);

// ==================================================
// Crear nuevo usuario
// ==================================================

router.post('/', userController.createUser);

// ==================================================
// Actualizar Usuario
// ==================================================

router.put('/:id', [verifyToken, verifyAdminOrMyself], userController.updateUser);

// ==================================================
// Borrar un usuario
// ==================================================

router.delete('/:id', verifyToken, userController.deleteUser);


module.exports = router;