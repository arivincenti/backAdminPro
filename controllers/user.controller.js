const userController = {};
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');

// ==================================================
// Obtener todos los usuarios
// ==================================================

userController.getUsers = async (req, res) => {

  try {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let count = await Usuario.count();

    let usuarios = await Usuario.find({}, 'nombre email img role')
    .skip(desde)
    .limit(5)
    .exec();

    res.status(200).json({
      ok: true,
      data: usuarios,
      total: count,
      usuario: req.usuario
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error cargando usuarios',
      errors: error
    });
  }
};

// ==================================================
// Crear un usuario
// ==================================================

userController.createUser = async (req, res) => {
  
  try {
    var body = req.body;
    var usuario = new Usuario({
      nombre: body.nombre,
      email: body.email,
      password: bcrypt.hashSync(body.password, 10),
      img: body.img,
      role: body.role
    });

    let usuarioCreado = await usuario.save();

    res.status(201).json({
      ok: true,
      data: usuarioCreado
    });

  } catch (error) {
    res.status(400).json({
      ok: false,
      mensaje: 'Error al crear usuarios',
      errors: error
    });
  }
};

// ==================================================
// Actualizar un usuario
// ==================================================

userController.updateUser = async (req, res) => {
  
  try {
    let id = req.params.id;
    let body = req.body;
    let usuario = await Usuario.findByIdAndUpdate(id, body, {new: true});

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al buscar el usuario con id ' + id,
        errors: {
          message: 'No existe un usuario con este id'
        }
      });
    }

    //Seteamos el password para no devolverlo en la respuesta
    usuario.password = ':)';

    res.status(200).json({
      ok: true,
      usuario: usuario
    });

  } catch (error) {

    res.status(400).json({
      ok: false,
      mensaje: 'Error al actualizar el usuario',
      errors: error
    });

  }
};

// ==================================================
// Eliminar un usuario
// ==================================================

userController.deleteUser = async (req, res) => {

  try {
    let id = req.params.id;
    let usuario = await Usuario.findByIdAndRemove(id);

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: 'No existe un usuario con ese id',
        errors: {
          message: 'No existe un usuario con ese id'
        }
      });
    }

    usuario.password = ':)';

    res.status(200).json({
      ok: true,
      usuario: usuario
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al borrar el usuario',
      errors: error
    });
  }

}

module.exports = userController;