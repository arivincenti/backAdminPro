const searchController = {};
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');
const Usuario = require('../models/usuario');

// ==================================================
// Obtener informacion de toda la base segun el parametro de busqueda
// ==================================================
searchController.searchAll = async (req, res) => {
  try {

    let busqueda = req.params.busqueda;
    let regExp = new RegExp(busqueda, 'i'); //Expresion regular para hacer consulta '% %'

    //let hospitales = await Hospital.find({"$text": { "$search": req.params.busqueda }});

    let hospitales = await Hospital.find({
        nombre: regExp
      })
      .populate('usuario');

    let medicos = await Medico.find({
        nombre: regExp
      })
      .populate('usuario')
      .populate('hospital');

    let usuarios = await Usuario.find({}, "nombre email role")
      .or([{
        nombre: regExp
      }, {
        email: regExp
      }]);

    res.status(200).json({
      ok: true,
      message: 'Busqueda realizada con exito',
      data: {
        hospitales,
        medicos,
        usuarios
      }
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al realizar la busqueda',
      errors: error
    });
  }
}

// ==================================================
// Obtener informacion por coleccion y parametro de busqueda
// ==================================================
searchController.searchInToCollection = async (req, res) => {
  try {
    var data = [];
    let collection = req.params.collection;
    let busqueda = req.params.busqueda;
    let regExp = new RegExp(busqueda, 'i'); //Expresion regular para hacer consulta '% %'

    //let hospitales = await Hospital.find({"$text": { "$search": req.params.busqueda }});

    switch (collection) {
      case 'hospitales':
        data = await Hospital.find({
            nombre: regExp
          })
          .populate('usuario');
        break;

      case 'medicos':
        data = await Medico.find({
            nombre: regExp
          })
          .populate('usuario')
          .populate('hospital');
        break;

      case 'usuarios':
        data = await Usuario.find({}, "nombre email role img google")
          .or([{
            nombre: regExp
          }, {
            email: regExp
          }]);
        break;

      default:
        res.status(500).json({
          ok: false,
          message: 'La busqueda solo se puede realizar sobre las collecciones "hospitales", "medicos" o "usuarios"',
          errors: {
            message: "Error al realizar la busqueda"
          }
        });
    }

    res.status(200).json({
      ok: true,
      message: 'Busqueda realizada con exito',
      data: data
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al realizar la busqueda',
      errors: error
    });
  }
}

module.exports = searchController;