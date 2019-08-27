const mongoose = require('mongoose');

const URI = 'mongodb://localhost:27017/hospitaldb';

mongoose.connect(URI, { useNewUrlParser: true }).then(db => {
  console.log('DB conectada');
}).catch(err => {
  console.log(err);
});

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

module.exports = mongoose;