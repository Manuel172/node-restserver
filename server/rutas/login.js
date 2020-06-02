const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Musuario = require('../modelos/musuario');

// para poder usar las rutas debe exportar el app mediante el module
const app = express();


app.post('/login', function(req, res) {

    let body = req.body;

    Musuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        if (!usuarioDB) {
            return res.status(500).json({
                ok: false,
                err: "Usuario/contraseña 1 incorrectos"
            });
        }

        if (!bcrypt.compareSync(body.clave, usuarioDB.clave)) {
            return res.status(500).json({
                ok: false,
                err: "Usuario/contraseña 2 incorrectos"
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.Semilla, { expiresIn: process.env.Caducidad });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token: token
        });
    });
});

module.exports = app;