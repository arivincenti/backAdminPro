const medicoController = {};
const Medico = require('../models/medico');

// ==================================================
// Obtener medicos
// ==================================================
medicoController.getMedicos = async (req, res) => {
  try {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let count = await Medico.count();

    let medicos = await Medico.find()
      .populate('usuario')
      .populate('hospital')
      .skip(desde)
      .limit(5);

    res.status(200).json({
      ok: true,
      message: 'Lista de medicos',
      data: medicos,
      total: count,
      usuario: req.usuario
    })

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error en get medicos',
      errors: error
    })
  }
}

// ==================================================
// Crear un medico
// ==================================================

medicoController.createMedico = async (req, res) => {
  try {
    let body = req.body;
    let newMedico = new Medico(body);

    let medico = await newMedico.save();

    res.status(200).json({
      ok: true,
      message: 'El medico se creo con éxito',
      data: medico,
      usuario: req.usuario
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al crear un medico',
      errors: error
    });
  }
}

// ==================================================
// Actualizar un medico
// ==================================================

medicoController.updateMedico = async (req, res) => {
  try {
    let id = req.params.id;
    let body = req.body;

    let medico = await Medico.findByIdAndUpdate(id, body, {
      new: true
    });

    if (!medico) {
      return res.status(400).json({
        ok: false,
        message: 'Error al buscar el medico con id ' + id,
        errors: {
          message: 'No existe un medico con este id'
        }
      });
    }

    res.status(200).json({
      ok: true,
      message: 'Medico actualizado con éxito',
      data: medico,
      usuario: req.usuario
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al actualizar un medico',
      errors: error
    });
  }
}

// ==================================================
// Eliminar un medico
// ==================================================

medicoController.deleteMedico = async (req, res) => {
  try {
    let id = req.params.id;

    let medico = await Medico.findByIdAndRemove(id);

    if (!medico) {
      return res.status(400).json({
        ok: false,
        message: 'Error al buscar el medico con id ' + id,
        errors: {
          message: 'No existe un medico con este id'
        }
      });
    }

    res.status(200).json({
      ok: true,
      message: 'El medico se elimino con éxito',
      data: medico,
      usuario: req.usuario
    })

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'Error al eliminar un medico',
      errors: error
    })
  }
}

module.exports = medicoController;