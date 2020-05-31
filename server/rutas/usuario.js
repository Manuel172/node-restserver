const express = require('express');
const Musuario = require('../modelos/musuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');

// para poder usar las rutas debe exportar el app mediante el module
const app = express();

// retornar listado de usuarios
app.get('/usuario', function(req, res) {

    let desde = req.query.desde;
    desde = Number(desde);

    let limite = req.query.limite;
    limite = Number(limite);

    Musuario.find({ estado: true }, '_id nombre email img rol estado google')
        .skip(desde)
        .limit(limite)
        .exec((err, respdata) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }

            Musuario.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    cantidad: conteo,
                    usuarios: respdata
                }); //envia json
            });
        });
});


app.post('/usuario', function(req, res) {
    //res.send('Hello World');  // envia html
    let body = req.body

    let lusuario = new Musuario({
        nombre: body.nombre,
        email: body.email,
        // encipta la clave primer parametro, el segundo parametro es la cantidad de vueltas de encriptacion
        clave: bcrypt.hashSync(body.clave, 10),
        rol: body.rol
    });

    lusuario.save((err, respData) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        res.json({
            ok: true,
            usuario: respData
        });
    });

});

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    //let body = req.body;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'rol', 'estado']);
    // tambien podria borrar los campos que no se desea modificar con delete
    // delete body.clave
    // (new: true =  devuelve data actualizada, false = devuelve data antes de actualizar)
    Musuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, respData) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        res.json({
            ok: "Put Data actualizada",
            id: id,
            usuario: respData
        });
    });


});

app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;

    // Eliminación fisica
    //Musuario.findByIdAndRemove(id, (err, respElim) => {

    let cambiaEstado = {
        estado: false
    };
    // se elimina logicamente con marca en estado
    Musuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, respElim) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        if (!respElim) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: respElim
        });
    });
});

module.exports = app;