//Requires
const express = require('express');
const mongoose = require('./database');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors')
const fileUpload = require('express-fileupload');

//Inicializar variables
const app = express();

//Settings
app.set('port', process.env.PORT || 3000);

//Middlewares
var corsOptions = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
}

app.use(cors(corsOptions));

// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Credentials', true);
//     res.header('Access-Control-Allow-Origin', req.headers.origin);
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
//   next();
// });

//app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('dev'));
app.use(fileUpload());


//Rutas
app.use('/login', require('./routes/login.routes'));
app.use('/usuarios', require('./routes/usuario.routes'));
app.use('/hospitales', require('./routes/hospital.routes'));
app.use('/medicos', require('./routes/medico.routes'));
app.use('/search', require('./routes/search.routes'));
app.use('/images', require('./routes/images.routes'));
app.use('/', require('./routes/app.routes'));

//Start server
app.listen(app.get('port'), () => {
  console.log('Express server corriendo en el puerto ' + app.get('port') + ': \x1b[32m%s\x1b[0m', 'online');
});