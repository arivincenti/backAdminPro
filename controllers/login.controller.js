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

// ==================================================
// Google Atuhentication
// ==================================================
loginController.googleAuthentication = async (req, res) => {
  try {
    let token = req.body.token;

    //Verifica que el token de google sea válido, si no lo es retorna el error
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
        //El usuario ya existe en la base de datos pero creo su cuenta con la autenticacion normal
        return res.status(400).json({
          ok: false,
          message: "Debe usar su autenticacion normal"
        });
      } else {
        //Como el usuario existe pero creó su cuenta a traves de google se le asigna un token para nuestra app
        usuario.password = ':)';
        await generateToken(usuario, res);
      }
    } else {
      //El usuario no existe en la base de datos asi que hay que crearlo y se le asigna la propiedad "usuario de google"
      let usuario = new Usuario();

      usuario.nombre = googleUser.nombre;
      usuario.email = googleUser.email;
      usuario.img = googleUser.img;
      usuario.google = true;
      usuario.password = ":)";

      const usuarioSaved = await usuario.save();

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
loginController.login = async (req, res) => {
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

    usuario.password = ':)';
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
// Renovar Token
// ==================================================
loginController.realoadToken = (req, res) => {
  try{
    generateToken(req.usuario, res);
  }catch(error){
    return res.status(500).json({
      ok: false,
      message: error
    });
  }
}

// ==================================================
// Generacion de token
// ==================================================
async function generateToken(usuario, res) {
  let token = jwt.sign({ usuario: usuario }, SEED, { expiresIn: 14000 });

  return res.status(200).json({
    ok: true,
    data: usuario,
    token: token,
    id: usuario._id,
    menu: obtenerMenu(usuario.role)
  });
}


// ==================================================
// Menú dinamico (Deberia venir desde la base de datos)
// ==================================================
function obtenerMenu(ROLE) {
  menu = [
    {
      title: "Principal",
      icon: "mdi mdi-gauge",
      submenu: [
        { subtitle: "Dashboard", url: "/dashboard" },
        { subtitle: "Graphics", url: "/graphics1" },
        { subtitle: "Progress", url: "/progress" },
        { subtitle: "Promises", url: "/promises" },
        { subtitle: "Rxjs", url: "/rxjs" }
      ]
    },
    {
      title: "Mantenimientos",
      icon: "mdi mdi-folder-lock-open",
      submenu: [
        // { subtitle: "Usuarios", url: "/usuarios" },
        { subtitle: "Medicos", url: "/medicos" },
        { subtitle: "Hospitales", url: "/hospitales" }
      ]
    }
  ];

  if (ROLE === "ADMIN_ROLE") {
    menu[1].submenu.unshift({ subtitle: "Usuarios", url: "/usuarios" });
  }

  return menu;
}

module.exports = loginController;
