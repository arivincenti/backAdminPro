const loginController = {};
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SEED } = require('../config/config');
const Usuario = require('../models/usuario');

loginController.authentication = async (req, res) => {

  try {
    let body = req.body;
    let usuario = await Usuario.findOne({
      email: body.email
    });

    if (!usuario) {
      res.status(400).json({
        ok: false,
        message: 'Credenciales incorrectas - email'
      });
    }

    if (!bcrypt.compareSync(body.password, usuario.password)) {
      res.status(400).json({
        ok: false,
        message: 'Credenciales incorrectas - password'
      });
    }

    //Se crea el token si todo va bien
    usuario.password = ':)';
    var token = jwt.sign({ usuario: usuario }, SEED, { expiresIn: 3600 });

    res.status(200).json({
      ok: true,
      data: usuario,
      token: token,
      id: usuario._id
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error
    });
  }
}


module.exports = loginController;