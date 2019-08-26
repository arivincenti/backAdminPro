const jwt = require('jsonwebtoken');
const { SEED } = require('../config/config');

exports.verifyToken = (req, res, next) => {

  var token = req.query.token;

  jwt.verify(token, SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Token no valido',
        errors: err
      });
    }

    //Se devuelve en el request la info del usuario logueado para proximas validaciones en los controladores
    req.usuario = decoded.usuario;

    next();

  });

}