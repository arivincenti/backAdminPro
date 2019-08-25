const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const Usuario = require('../models/usuario');

// ==================================================
// Obtener todos los usuarios
// ==================================================

app.get('/', (req, res) => {

  Usuario.find({}, 'nombre email img role').exec((err, usuarios) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error cargando usuarios',
        errors: err
      });
    }
    res.status(200).json({
      ok: true,
      usuario: usuarios
    });
  });
});

// ==================================================
// Crear nuevo usuario
// ==================================================

app.post('/', (req, res) => {
  var body = req.body;

  var usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    role: body.role
  });

  usuario.save((err, usuarioCreado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al crear usuarios',
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      usuario: usuarioCreado
    });

  });


});

// ==================================================
// Actualizar Usuario
// ==================================================

app.put('/:id', (req, res) => {
  var id = req.params.id;
  var body = req.body;

  Usuario.findById(id, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar el usuario',
        errors: err
      });
    }

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al buscar el usuario con id ' + id,
        errors: {
          message: 'No existe un usuario con este id'
        }
      });
    }

    usuario.nombre = body.nombre;
    usuario.email = body.email;
    usuario.role = body.role;

    usuario.save((err, usuarioGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Error al actualizar el usuario',
          errors: err
        });
      }

      usuarioGuardado.password = ':)';

      res.status(200).json({
        ok: true,
        usuario: usuarioGuardado
      });
    });
  });

});

// ==================================================
// Borrar un usuario
// ==================================================

app.delete('/:id', (req, res) => {
  var id = req.params.id;

  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al borrar el usuario',
        errors: err
      });
    }

    if (!usuarioBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: 'No existe un usuario con ese id',
        errors: {message: 'No existe un usuario con ese id'}
      });
    }

    usuarioBorrado.password = ':)';

    res.status(200).json({
      ok: true,
      usuario: usuarioBorrado
    });
  });
});

module.exports = app;