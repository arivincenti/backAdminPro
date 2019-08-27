var hospitalController = {};
const Hospital = require('../models/hospital');

// ==================================================
// Obtener todos los hospitales
// ==================================================
hospitalController.getHospitales = async (req, res) => {
  try {

    let hospitales = await Hospital.find();

    res.status(200).json({
      ok: true,
      message: 'Hospitales con exito',
      data: hospitales,
      usuario: req.usuario
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al cargar los hopistales',
      errors: error
    });
  }
};

// ==================================================
// Crear un hospital
// ==================================================
hospitalController.createHospital = async (req, res) => {
  try {

    let body = req.body;
    let newHospital = new Hospital(body);

    let hospital = await newHospital.save();

    res.status(200).json({
      ok: true,
      message: 'Hospital creado con exito',
      data: hospital,
      usuario: req.usuario
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al insertar un hospital',
      errors: error
    });
  }
}

// ==================================================
// Actualizar un hospital
// ==================================================
hospitalController.updateHospital = async (req, res) => {
  try {
    let id = req.params.id;
    let body = req.body;

    let hospital = await Hospital.findByIdAndUpdate(id, body, {
      new: true
    });

    if (!hospital) {
      return res.status(400).json({
        ok: false,
        message: 'Error al buscar el hospital con id ' + id,
        errors: {
          message: 'No existe un hospital con este id'
        }
      });
    }

    res.status(200).json({
      ok: true,
      message: 'Hospital actualizado con exito',
      data: hospital,
      usuario: req.usuario
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al insertar un hospital',
      errors: error
    });
  }
}

// ==================================================
// Eliminiar un hospital
// ==================================================

hospitalController.deleteHospital = async (req, res) => {
  try {
    let id = req.params.id;
    let hospital = await Hospital.findByIdAndRemove(id);

    if (!hospital) {
      return res.status(400).json({
        ok: false,
        message: 'Error al buscar el hospital con id ' + id,
        errors: {
          message: 'No existe un hospital con este id'
        }
      });
    }

    res.status(200).json({
      ok: true,
      message: 'Hospital eliminado con exito',
      data: hospital,
      usuario: req.usuario
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al eliminar un hospital',
      errors: error
    });
  }
}

module.exports = hospitalController;