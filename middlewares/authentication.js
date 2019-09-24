const jwt = require("jsonwebtoken");
const { SEED } = require("../config/config");

// ==================================================
// Verifica que el token sea válido
// ==================================================
exports.verifyToken = (req, res, next) => {
  var token = req.query.token;

  jwt.verify(token, SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        mensaje: "Token no valido",
        errors: err
      });
    }

    //Se devuelve en el request la info del usuario logueado para proximas validaciones en los controladores
    req.usuario = decoded.usuario;

    next();
  });
};

// ==================================================
// Verifica si es administrador o el mismo usuario
// ==================================================
exports.verifyAdminOrMyself = (req, res, next) => {
  var usuario = req.usuario;
  var id = req.params.id;
  console.log(usuario);
  if (usuario.role === "ADMIN_ROLE" || usuario._id === id) {
    next();
  } else {
    return res.status(401).json({
      ok: false,
      mensaje: "No está autorizado"
    });
  }
};
