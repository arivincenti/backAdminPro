//Requires
var express = require('express');
var mongoose = require('mongoose');

//Inicializar variables
var app = express();

//Conexion con la BBDD
mongoose.connection.openUri('mongodb://localhost:27017/hospitaldb', (err, res) => {
  if(err) throw err;
  console.log('BBDD: \x1b[32m%s\x1b[0m','online');
});

//Rutas
app.get('/', (req, res, next) => {
  res.status(200).json({
    ok: true,
    mensaje: 'Peticion realizada correctamente'
  });
})

//Escuchr peticiones
app.listen(3000, () => {
  console.log('Express server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m','online');
});