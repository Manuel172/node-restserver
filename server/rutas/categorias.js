const express = require('express');
const mcategorias = require('../modelos/mcategoria');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autorizacion');


// para poder usar las rutas debe exportar el app mediante el module
const app = express();

// retorna todas las categorias, por pagina
app.get('/categorias', verificaToken, (req, res) => {
    let desde = req.query.desde;
    desde = Number(desde);
    let limite = req.query.limite;
    limite = Number(limite);

    mcategorias.find({})
        .skip(desde)
        .limit(limite)
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, respdata) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }
            mcategorias.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    cantidad: conteo,
                    //usuToken: true,
                    categorias: respdata
                }); //envia json
            });
        });

});

// retorna una categoria segun id enviado
app.get('/categorias/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    mcategorias.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id Categoria no existe'
                }
            });
        }

        res.json({
            ok: true,
            categoriaDB: categoriaDB,
        });
    }).populate('usuario', 'email', 'musuarios');

});


// crea una categoria
app.post('/categorias', [verificaToken, verificaAdmin_Role], (req, res) => {
    let body = req.body

    console.log(req.tokenUsuario);
    let lcategoria = new mcategorias({
        descripcion: body.descripcion,
        usuario: req.tokenUsuario._id
    });

    console.log(lcategoria);

    lcategoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        res.json({
            ok: true,
            //usuToken: req.tokenUsuario,
            categoria: categoriaDB
        });
    });

});


// Modifica Categoria segun id entregado
app.put('/categorias/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    let body = {
        descripcion: req.body.descripcion,
        usuario: req.tokenUsuario._id
    };

    mcategorias.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, respData) => {
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
                    message: 'Id Categoria no existe'
                }
            });
        }

        res.json({
            ok: "Categoria actualizada",
            categoria: respData
        });
    });

});



app.delete('/categorias/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    mcategorias.findByIdAndRemove(id, (err, respElim) => {
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
                    message: 'Id Categoria no existe'
                }
            });
        }

        res.json({
            ok: true,
            //usuToken: req.tokenUsuario,
            categoria: respElim
        });
    });


});

module.exports = app;