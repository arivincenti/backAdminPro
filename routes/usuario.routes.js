const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authentication');
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

router.put('/:id', userController.updateUser);

// ==================================================
// Borrar un usuario
// ==================================================

router.delete('/:id', userController.deleteUser);


module.exports = router;