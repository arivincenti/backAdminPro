const imagesController = {};
const fs = require('fs');
const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');
const path = require('path');

// ==================================================
// Obtener imagenes
// ==================================================
imagesController.getImage = (req, res) => {

  try{

    var tipo = req.params.tipo;
    var img = req.params.img;

    var pathImage = path.resolve( __dirname, `../uploads/${tipo}/${img}` );

    if(fs.existsSync(pathImage)){
      res.sendFile(pathImage);
    }else{
      var pathNoImgae = path.resolve( __dirname, `../assets/images/no-img.jpg` );
      res.sendFile(pathNoImgae);
    }

  }catch(error){
    res.status(500).json({
      ok: false,
      message: 'Error al subir el archivo',
      errors: error
    });
  }
}

// ==================================================
// Subir archivos al server
// ==================================================
imagesController.uploadFile = async (req, res) => {
  try {

    var tipo = req.params.tipo;
    var id = req.params.id;

    if (!req.files) {
      return res.status(400).json({
        ok: false,
        message: 'No se selecciono nada',
        errors: {
          message: 'No selecciono ninguna imagen'
        }
      });
    }

    //Obtener nombre del archivo
    var archivo = req.files.imagen;
    let archivoSplit = archivo.name.split('.');
    let extension = archivoSplit[archivoSplit.length - 1];

    //Validacion de extensiones
    let extensionesValidas = ['png', 'jpg', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
      return res.status(400).json({
        ok: false,
        message: 'Extension de archivo no valida',
        errors: {
          message: 'Las extenciones validas son ' + extensionesValidas.join(', ')
        }
      });
    }

    //Validar tipo de coleccion
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
      return res.status(400).json({
        ok: false,
        message: 'Tipo de coleccion no valida',
        errors: {
          message: 'Las colecciones validas a las que se les puede cargar una imagen son ' + tiposValidos.join(', ')
        }
      });
    }

    //Nombre de archivo personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    //Mover el archivo del temporal a un path especifico
    var path = `./uploads/${tipo}/${nombreArchivo}`;


    switch (tipo) {
      case 'usuarios':
        await uploadImage(tipo, id, Usuario, archivo, nombreArchivo, path, res);
        break;
      case 'medicos':
        await uploadImage(tipo, id, Medico, archivo, nombreArchivo, path, res);
        break;
      case 'hospitales':
        await uploadImage(tipo, id, Hospital, archivo, nombreArchivo, path, res);
        break;
      default:
        res.status(400).json({
          ok: false,
          message: 'Las colecciones validas a las que se les puede cargar una imagen son ' + tiposValidos.join(', '),
          errors: {
            message: "Error al intentar actualizar la imagen"
          }
        });
    }

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al subir el archivo',
      errors: error
    });
  }
};

async function uploadImage(tipo, id, model, archivo, nombreArchivo, path, res) {

  try {
    var data = await model.findById(id);
    if (!data) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al buscar el id ' + id,
        errors: {
          message: 'No existe el id'
        }
      });
    }

    var pathViejo = `./uploads/${tipo}/${data.img}`;
    //Si existe, elimina el path viejo del usuario
    if (fs.existsSync(pathViejo)) {
      fs.unlinkSync(pathViejo);
    }

    data.img = nombreArchivo;

    var dataSaved = await data.save();

    //Movemos la imagen al folder del server
    await archivo.mv(path);

    return res.status(200).json({
      ok: true,
      message: 'Imagen actualizada',
      data: dataSaved
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al subir la imagen',
      errors: error
    });
  }

}

module.exports = imagesController;