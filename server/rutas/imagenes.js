const express = require('express');
const musuarios = require('../modelos/musuario');
const mproductos = require('../modelos/producto');
const { verificaTokenImg } = require('../middlewares/autorizacion');
const fs = require('fs');
const path = require('path');
const app = express();

// default options
//app.use(fileUpload());

app.get('/imagen/:tipo/:img', verificaTokenImg, function(req, res) {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (!fs.existsSync(pathImagen)) {
        pathImagen = path.resolve(__dirname, '../assets/no_img.jpg');
    }

    res.sendFile(pathImagen);
});

module.exports = app;