//Requires
const express = require('express');
const mongoose = require('mongoose');
const appRoutes = require('./routes/app');
const usuarioRoutes = require('./routes/usuario');
const bodyParser = require('body-parser');


//Inicializar variables
const app = express();

//BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Conexion con la BBDD
mongoose.connection.openUri('mongodb://localhost:27017/hospitaldb', (err, res) => {
  if(err) throw err;
  console.log('BBDD: \x1b[32m%s\x1b[0m','online');
});

//Rutas importadas
app.use('/usuarios', usuarioRoutes);
app.use('/', appRoutes);

//Escuchr peticiones
app.listen(3000, () => {
  console.log('Express server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m','online');
});