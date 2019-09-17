const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authentication');
const hospitalController = require('../controllers/hospital.controller');

// ==================================================
// Obtener todos los hospitales
// ==================================================
router.get('/', verifyToken, hospitalController.getHospitales);

// ==================================================
// Obtener un hospital
// ==================================================
router.get('/:id', verifyToken, hospitalController.getHospital);

// ==================================================
// Crear un hospital
// ==================================================
router.post('/', verifyToken, hospitalController.createHospital);

// ==================================================
// Actualizar un hospital
// ==================================================
router.put('/:id', verifyToken, hospitalController.updateHospital);

// ==================================================
// Eliminiar un hospital
// ==================================================
router.delete('/:id', verifyToken, hospitalController.deleteHospital);

module.exports = router;