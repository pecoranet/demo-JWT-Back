const express = require('express');
const bodyparser = require('body-parser');
require('dotenv').config();
require('./database/connection');

const app = express();

// cors
const cors = require('cors');
var corsOptions = {
    origin: '*', // Reemplazar con dominio
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

//capturar body
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// import routes
const authRoutes = require('./routes/auth');
const validaTokenMiddle = require('./routes/middleware/validate-token');
const admin = require('./routes/admin');

// route middlewares
app.use('/api/user', authRoutes);
app.use('/api/admin', validaTokenMiddle, admin);

// Para que la configuración de vue se aplique al servidor.
const history = require('connect-history-api-fallback');
app.use(history);
app.use(express.static(__dirname + '/public'));

// iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log('[Server] OK Port:', PORT);
})