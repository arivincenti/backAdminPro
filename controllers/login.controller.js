const loginController = {};
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SEED } = require("../config/config");
const { CLIENT_ID } = require("../config/config");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(CLIENT_ID);
const Usuario = require("../models/usuario");

// ==================================================
// Autenticacion de google
// ==================================================

async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  //const userid = payload['sub'];
  // If request specified a G Suite domain:
  //const domain = payload['hd'];ç
  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  };
}

loginController.googleAuthentication = async (req, res) => {
  try {
    let token = req.body.token;

    var googleUser = await verify(token).catch(error => {
      return res.status(403).json({
        ok: false,
        error: error,
        message: "Token no válido"
      });
    });

    const usuario = await Usuario.findOne({
      email: googleUser.email
    });

    if (usuario) {
      if (usuario.google === false) {
        //El usuario ya existe en la base de datos pero creo us cuenta con la autenticacion normal
        return res.status(400).json({
          ok: false,
          message: "Debe usar su autenticacion normal"
        });
      } else {
        await generateToken(usuario, res);
      }
    } else {
      //El usuario no existe asi que hay que crearlo
      let usuario = new Usuario();

      usuario.nombre = googleUser.nombre;
      usuario.email = googleUser.email;
      usuario.img = googleUser.img;
      usuario.google = true;

      const usuarioSaved = await usuario.save();
      usuarioSaved.password = ":)";

      await generateToken(usuarioSaved, res);
    }

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error
    });
  }
};


// ==================================================
// Autenticacion normal
// ==================================================
loginController.authentication = async (req, res) => {
  try {
    let body = req.body;
    let usuario = await Usuario.findOne({
      email: body.email
    });

    if (!usuario) {
      res.status(400).json({
        ok: false,
        message: "Credenciales incorrectas - email"
      });
    }

    if (!bcrypt.compareSync(body.password, usuario.password)) {
      res.status(400).json({
        ok: false,
        message: "Credenciales incorrectas - password"
      });
    }

    usuario.password = ":)";
    //Se crea el token si todo va bien
    
    await generateToken(usuario, res);
    
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error
    });
  }
};

// ==================================================
// Generacion de token
// ==================================================
async function generateToken(usuario, res) {
  let token = jwt.sign(
    { usuario: usuario },
    SEED,
    { expiresIn: 14000 }
  );

  return res.status(200).json({
    ok: true,
    data: usuario,
    token: token,
    id: usuario._id
  });
}

module.exports = loginController;
