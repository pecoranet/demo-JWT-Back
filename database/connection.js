const mongoose = require('mongoose');
require('dotenv').config();

// Conexion a base de datos
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@pecoracluster.mpc6c.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
const uriOptions = { useNewUrlParser: true, useUnifiedTopology: true };

mongoose
    .connect(uri, uriOptions)
    .then( () => console.log('[Database] OK!!') )
    .catch( (err) => console.log('[Database] ERROR: ' + err) );
