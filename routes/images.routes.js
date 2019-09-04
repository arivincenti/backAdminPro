const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authentication');
const imagesController = require('../controllers/images.controller');


// ==================================================
// Obtener imagenes
// ==================================================
router.get('/:tipo/:img', imagesController.getImage);

// ==================================================
// Subir archivos al server
// ==================================================
router.put('/upload/:tipo/:id', imagesController.uploadFile);


module.exports = router;