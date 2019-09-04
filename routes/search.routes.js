const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authentication');
const searchController = require('../controllers/search.controller');

// ==================================================
// Obtener informacion de toda la base segun el parametro de busqueda
// ==================================================
router.get('/search/:busqueda', searchController.searchAll);

// ==================================================
// Obtener informacion por coleccion y parametro de busqueda
// ==================================================
router.get('/search/:collection/:busqueda', searchController.searchInToCollection);

module.exports = router;