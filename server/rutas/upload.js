const express = require('express');
const fileUpload = require('express-fileupload');
const musuarios = require('../modelos/musuario');
const mproductos = require('../modelos/producto');
const fs = require('fs');
const path = require('path');
const app = express();

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).
        json({
            ok: false,
            err: {
                message: 'No se ha selecionado un archivo'
            }
        });
    }

    let tiposValidas = ['usuarios', 'productos'];
    if (tiposValidas.indexOf(tipo) < 0) {
        return res.status(500).json({
            ok: false,
            err: {
                message: "Tipos permitidos son: " + tiposValidas,
                tipo_ingreado: tipo
            }
        });
    }


    // The name of the input field 
    let archivo = req.files.archivo;
    let extValidas = ['jpg', 'gif', 'png', 'jpeg'];
    nombreArreglo = archivo.name.split('.');
    extension = nombreArreglo[1];


    if (extValidas.indexOf(extension) < 0) {
        return res.status(500).json({
            ok: false,
            err: {
                message: "Archivos validos son: " + extValidas.join(', '),
                ext: extension
            }
        });
    }

    // cambio nombre del archivo para hacerlo unico
    let fecha = new Date();
    let minutos = fecha.getMinutes();
    let segundos = fecha.getMilliseconds();

    let nombreArchivo = `${id}-${segundos}-${minutos}.${extension}`;
    //console.log(nombreArchivo);
    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }
        if (tipo === 'usuarios') {
            usuario(id, res, nombreArchivo);
        } else {
            productos(id, res, nombreArchivo);
        }


    });

});

function usuario(id, res, archivo) {

    musuarios.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(archivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        if (!usuarioDB) {
            borraArchivo(archivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }


        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = archivo;

        usuarioDB.save((err, dataActualizada) => {
            return res.json({
                ok: true,
                usuario: dataActualizada
            });
        });


    });

}

function productos(id, res, archivo) {

    mproductos.findById(id, (err, productosDB) => {
        if (err) {
            borraArchivo(archivo, 'productos');
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        if (!productosDB) {
            borraArchivo(archivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }


        borraArchivo(productosDB.img, 'productos');

        productosDB.img = archivo;
        productosDB.save((err, dataActualizada) => {
            return res.json({
                ok: true,
                producto: dataActualizada
            });
        });


    });

}

function borraArchivo(imagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${imagen}`);
    console.log('path imagen: ', pathImagen);
    // verifica si archivo existe
    if (fs.existsSync(pathImagen)) {
        // elimina archivo
        fs.unlinkSync(pathImagen);
    }

}
module.exports = app;