const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authentication');
const medicoController = require('../controllers/medico.controller');

// ==================================================
// Obtener medicos
// ==================================================
router.get('/', verifyToken, medicoController.getMedicos);

// ==================================================
// Obtener medicos
// ==================================================
router.get('/:id', verifyToken, medicoController.getMedico);

// ==================================================
// Crear un medico
// ==================================================
router.post('/', verifyToken, medicoController.createMedico);

// ==================================================
// Actualizar un  medico
// ==================================================
router.put('/:id', verifyToken, medicoController.updateMedico);

// ==================================================
// Eliminar un medico
// ==================================================
router.delete('/:id', verifyToken, medicoController.deleteMedico);


module.exports = router;