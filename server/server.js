require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();

// parse application/x-www-form-urlencoded // para recibir datos enviados en el post
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

///////////// Llamar todas las routas/
app.use(require('./rutas/index'));
//////////////////////// fin rutas /////////////////////

mongoose.connect(process.env.urlDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}, (err, resp) => {
    if (err) throw err;
    console.log("Base de Datos Conectada.");
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto ${process.env.PORT}`);
});