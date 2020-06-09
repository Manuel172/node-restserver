const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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


// api servicio invocado desde el front
app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    console.log('google token: ', token);
    let googleUser = await verify(token)
        .catch((err) => {
            return res.status(403).json({
                ok: false,
                err: err
            });
        });


    Musuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                otro: "error 1",
                err: err
            });
        }

        if (usuarioDB) {
            // usuario existe con autentificación normal
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: "Usuario Existe, debe usar autentificación normal"
                });
            } else {
                // usuario existe generado desde google; se le actualiza su token
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.Semilla, { expiresIn: process.env.Caducidad });

                res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token
                });
            }
        } else {
            // usuario no existe y se debe crear en la base de datos
            let usuario = new Musuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.clave = ':)';

            usuario.save((err, respData) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        otro: "error 3",
                        err: err
                    });
                }

                let token = jwt.sign({
                    usuario: respData
                }, process.env.Semilla, { expiresIn: process.env.Caducidad });

                res.json({
                    ok: true,
                    usuario: respData,
                    token: token
                });

            });
        }
    });
});

// configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];

    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}


module.exports = app;