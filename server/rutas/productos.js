const express = require('express');
const mproductos = require('../modelos/producto');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autorizacion');

// para poder usar las rutas debe exportar el app mediante el module
const app = express();


// retorna todos los productos con la relación a categoria y usuario, contempla parametros para paginar
app.get('/productos', verificaToken, (req, res) => {
    let desde = req.query.desde;
    desde = Number(desde);
    let limite = req.query.limite;
    limite = Number(limite);

    mproductos.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, respdata) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err
                });
            }
            mproductos.countDocuments({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    cantidad: conteo,
                    //usuToken: true,
                    productos: respdata
                }); //envia json
            });
        });
});

// retorna todos los productos segun termino ingresado, contempla parametros para paginar
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let desde = req.query.desde;
    desde = Number(desde);
    let limite = req.query.limite;
    limite = Number(limite);

    //La expresión regular permite buscar coincidencia con el termino ingresado.
    const regExp = new RegExp(req.params.termino, 'i');

    mproductos.find({ nombre: regExp })
        .skip(desde)
        .limit(limite)
        .sort('nombre')
        .populate('categoria', 'descripcion')
        .exec((err, respdata) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err
                });
            }
            mproductos.countDocuments({ nombre: regExp }, (err, conteo) => {
                res.json({
                    ok: true,
                    cantidad: conteo,
                    //usuToken: true,
                    productos: respdata
                }); //envia json
            });
        });

});


// retorna un producto según id enviado
app.get('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    mproductos.findById(id)
        .populate('usuario', 'email', 'musuarios')
        .populate('categoria', 'descripcion')
        .exec((err, productosDB) => {
            console.log(productosDB);
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err
                });
            }

            if (!productosDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Id Producto no existe'
                    }
                });
            }

            res.json({
                ok: true,
                productosDB: productosDB
            });

        });

});


// crea una producto, debe recibir el id de la categoria, el id de usuario se obtiene al validar el token
app.post('/productos', [verificaToken, verificaAdmin_Role], (req, res) => {
    let body = req.body

    let lproducto = new mproductos({
        nombre: body.nombre,
        precioUni: body.preciouni,
        descripcion: body.descripcion,
        categoria: body.id_categoria,
        usuario: req.tokenUsuario._id
    });

    console.log(lproducto);

    lproducto.save((err, productosDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        if (!productosDB) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        res.status(201).json({
            ok: true,
            //usuToken: req.tokenUsuario,
            productosDB: productosDB
        });
    });

});


// Modifica un producto según id entregado
app.put('/productos/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    let body = {
        nombre: req.body.nombre,
        preciouni: req.body.preciouni,
        descripcion: req.body.descripcion,
        categoria: req.body.id_categoria,
        disponible: req.body.disponible,
        usuario: req.tokenUsuario._id
    };

    mproductos.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, respData) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }


        if (!respData) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id Producto no existe'
                }
            });
        }

        res.json({
            ok: "Producto actualizado",
            categoria: respData
        });
    });

});


// Elimina Logicamente un producto según id entregado, en este caso producto queda sin disponibilidad
app.delete('/productos/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    let cambiaDiponible = {
        disponible: false
    };
    // se elimina logicamente con marca en estado
    mproductos.findByIdAndUpdate(id, cambiaDiponible, { new: true }, (err, respElim) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        if (!respElim) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id de Producto no encontrado'
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