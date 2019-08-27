//Requires
const express = require('express');
const mongoose = require('./database');
const bodyParser = require('body-parser');
const morgan = require('morgan');


//Inicializar variables
const app = express();

//Settings
app.set('port', process.env.PORT || 3000);

//Middlewares
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('dev'));


//Rutas
app.use('/login', require('./routes/login.routes'));
app.use('/usuarios', require('./routes/usuario.routes'));
app.use('/hospitales', require('./routes/hospital.routes'));
app.use('/medicos', require('./routes/medico.routes'));
app.use('/', require('./routes/app.routes'));

//Start server
app.listen(app.get('port'), () => {
  console.log('Express server corriendo en el puerto ' + app.get('port') + ': \x1b[32m%s\x1b[0m','online');
});